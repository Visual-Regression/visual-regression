import { it, expect, describe } from 'vitest';
import { detectCi } from './ci';

const github = {
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: 'FRSOURCE/plugin',
  GITHUB_SHA: 'merge-sha',
  GITHUB_RUN_ID: '123',
  GITHUB_RUN_ATTEMPT: '2',
  GITHUB_RUN_NUMBER: '7',
  GITHUB_JOB: 'test',
  GITHUB_WORKFLOW: 'CI',
  GITHUB_SERVER_URL: 'https://github.com',
  GITHUB_WORKSPACE: '/home/runner/work/plugin/plugin',
  GITHUB_EVENT_PATH: '/tmp/event.json',
};

describe('detectCi', () => {
  it('returns null outside CI', () => {
    expect(detectCi({})).toBeNull();
    expect(detectCi({ CI: 'false' })).toBeNull();
    expect(detectCi({ CI: '0' })).toBeNull();
  });

  it('reports an unknown provider when only CI is set', () => {
    expect(detectCi({ CI: 'true' })).toEqual({ provider: null });
  });

  it('reads a GitHub Actions pull_request run, including the PR head sha from the event payload', () => {
    const readJson = (file: string) => {
      expect(file).toBe('/tmp/event.json');
      return { pull_request: { number: 42, head: { sha: 'head-sha' } } };
    };

    expect(
      detectCi(
        {
          ...github,
          GITHUB_EVENT_NAME: 'pull_request',
          GITHUB_REF: 'refs/pull/42/merge',
          GITHUB_HEAD_REF: 'feat/x',
          GITHUB_BASE_REF: 'main',
        },
        readJson,
      ),
    ).toEqual({
      provider: 'github',
      repositoryName: 'FRSOURCE/plugin',
      repositoryUrl: 'https://github.com/FRSOURCE/plugin',
      commit: 'merge-sha',
      ref: 'refs/pull/42/merge',
      branchName: 'feat/x',
      pullRequest: {
        number: 42,
        headSha: 'head-sha',
        headRef: 'feat/x',
        baseRef: 'main',
      },
      event: 'pull_request',
      buildId: '123',
      buildName: 'CI',
      buildNumber: '7',
      buildUrl:
        'https://github.com/FRSOURCE/plugin/actions/runs/123/attempts/2',
      runAttempt: '2',
      job: 'test',
      serverUrl: 'https://github.com',
      workspace: '/home/runner/work/plugin/plugin',
    });
  });

  it('reads a GitHub Actions push run without a pull request', () => {
    const ci = detectCi(
      {
        ...github,
        GITHUB_EVENT_NAME: 'push',
        GITHUB_REF: 'refs/heads/main',
        GITHUB_REF_NAME: 'main',
        GITHUB_HEAD_REF: '',
        GITHUB_RUN_ATTEMPT: undefined,
        GITHUB_SERVER_URL: undefined,
      },
      () => ({}),
    );

    expect(ci).toMatchObject({
      provider: 'github',
      branchName: 'main',
      pullRequest: null,
      serverUrl: 'https://github.com',
      repositoryUrl: 'https://github.com/FRSOURCE/plugin',
      buildUrl: 'https://github.com/FRSOURCE/plugin/actions/runs/123',
    });
    expect(ci).not.toHaveProperty('runAttempt');
  });

  it('takes the PR number from the event payload of an issue_comment run', () => {
    const readJson = () => ({
      issue: { number: 7, pull_request: { url: 'x' } },
    });
    expect(
      detectCi(
        {
          ...github,
          GITHUB_EVENT_NAME: 'issue_comment',
          GITHUB_REF: 'refs/heads/main',
        },
        readJson,
      )?.pullRequest,
    ).toEqual({ number: 7 });
  });

  it('survives a missing or unreadable event payload', () => {
    const unreadable = () => {
      throw new Error('ENOENT');
    };
    expect(
      detectCi({ ...github, GITHUB_REF: 'refs/pull/5/merge' }, unreadable)
        ?.pullRequest,
    ).toEqual({ number: 5 });
    expect(
      detectCi({ ...github, GITHUB_EVENT_PATH: undefined }, unreadable)
        ?.pullRequest,
    ).toBeNull();
    expect(detectCi(github, () => 'not an object')?.pullRequest).toBeNull();
  });

  it('reads a GitLab merge request pipeline', () => {
    expect(
      detectCi({
        GITLAB_CI: 'true',
        CI_PROJECT_PATH: 'group/project',
        CI_COMMIT_SHA: 'sha',
        CI_COMMIT_REF_NAME: 'feat/x',
        CI_MERGE_REQUEST_IID: '12',
        CI_MERGE_REQUEST_SOURCE_BRANCH_NAME: 'feat/x',
        CI_MERGE_REQUEST_SOURCE_BRANCH_SHA: 'head-sha',
        CI_MERGE_REQUEST_TARGET_BRANCH_NAME: 'main',
        CI_PIPELINE_SOURCE: 'merge_request_event',
        CI_PIPELINE_ID: '99',
        CI_PIPELINE_IID: '42',
        CI_PIPELINE_NAME: 'e2e pipeline',
        CI_PROJECT_URL: 'https://gitlab.com/group/project',
        CI_JOB_NAME: 'e2e',
        CI_JOB_ID: '1001',
        CI_SERVER_URL: 'https://gitlab.com',
        CI_JOB_URL: 'https://gitlab.com/group/project/-/jobs/1001',
        CI_PROJECT_DIR: '/builds/group/project',
      }),
    ).toEqual({
      provider: 'gitlab',
      repositoryName: 'group/project',
      repositoryUrl: 'https://gitlab.com/group/project',
      commit: 'sha',
      ref: 'feat/x',
      branchName: 'feat/x',
      pullRequest: {
        number: 12,
        headSha: 'head-sha',
        headRef: 'feat/x',
        baseRef: 'main',
      },
      event: 'merge_request_event',
      buildId: '99',
      buildName: 'e2e pipeline',
      buildNumber: '42',
      buildUrl: 'https://gitlab.com/group/project/-/jobs/1001',
      job: 'e2e',
      jobId: '1001',
      serverUrl: 'https://gitlab.com',
      workspace: '/builds/group/project',
    });
  });

  it('reads a GitLab branch pipeline', () => {
    expect(
      detectCi({
        GITLAB_CI: 'true',
        CI_COMMIT_BRANCH: 'main',
        CI_COMMIT_REF_NAME: 'main',
      }),
    ).toEqual({
      provider: 'gitlab',
      ref: 'main',
      branchName: 'main',
      pullRequest: null,
    });
  });
});

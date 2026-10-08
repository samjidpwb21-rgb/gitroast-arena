/**
 * Single GraphQL Query for GitRoast Arena
 * Fetches profile, account type, pinned repositories, profile README, contributions,
 * and up to 100 repositories with languages, topics, and flagship candidate READMEs.
 */
export const GITHUB_PORTFOLIO_QUERY = `
query GetUserPortfolio($login: String!) {
  repositoryOwner(login: $login) {
    __typename
    login
  }
  user(login: $login) {
    __typename
    login
    name
    bio
    avatarUrl
    company
    location
    websiteUrl
    createdAt
    followers {
      totalCount
    }
    following {
      totalCount
    }
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
        }
      }
    }
    profileReadme: repository(name: $login) {
      object(expression: "HEAD:README.md") {
        ... on Blob {
          text
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
      }
    }
    repositories(
      first: 100
      orderBy: { field: PUSHED_AT, direction: DESC }
      ownerAffiliations: [OWNER]
    ) {
      totalCount
      nodes {
        name
        nameWithOwner
        description
        isFork
        isArchived
        stargazerCount
        forkCount
        pushedAt
        updatedAt
        createdAt
        homepageUrl
        licenseInfo {
          spdxId
        }
        repositoryTopics(first: 10) {
          nodes {
            topic {
              name
            }
          }
        }
        primaryLanguage {
          name
        }
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
            }
          }
        }
        readmeUpper: object(expression: "HEAD:README.md") {
          ... on Blob {
            text
          }
        }
        readmeLower: object(expression: "HEAD:readme.md") {
          ... on Blob {
            text
          }
        }
      }
    }
  }
}
`;

import * as d3 from "d3"
import { useEffect, useState } from "react";

export {fetchDiscussions, useFetchDiscussionJson, sortDiscussionsByUniqueCommenters}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.OWNER;
const REPO = process.env.REPO;


interface Discussion {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: string;
  averageResponseTime?: number;
  acceptedAnswerAuthor?: string;
  participants: string[];
  questioner: string;
  questionerActivity?: number;
  views?: number;
  status?: string;
}


// GraphQL
 async function fetchDiscussions(): Promise<Discussion[]> {
  const query = `
    query {
      repository(owner: "${OWNER}", name: "${REPO}") {
        discussions(first: 100, orderBy: { field: CLOSED_AT, direction: DESC }) {
          edges {
            node {
              id
              title
              url
              category { name }
              createdAt
              closedAt
              answerChosenAt
              answer {
                author { login }
              }
              author {
                login
              }
              comments(first: 100) {
                edges {
                  node {
                    author { login }
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    }`;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  console.log("check", JSON.stringify(data));
  return processDiscussionData(data);
}


function processDiscussionData(apiData: any): Discussion[] {
  return apiData.data.repository.discussions.nodes.map((discussion: any) => {
    const comments = discussion.comments.nodes;
    const firstResponseTime =
      comments.length > 0
        ? new Date(comments[0].createdAt).getTime() -
          new Date(discussion.createdAt).getTime()
        : null;

    return {
      id: discussion.id,
      title: discussion.title,
      url: discussion.url,
      category: discussion.category.name,
      createdAt: discussion.createdAt,
      averageResponseTime: firstResponseTime
        ? firstResponseTime / 1000 / 60
        : undefined, 
      acceptedAnswerAuthor: discussion.answer?.author.login || null,
      participants: [...new Set(comments.map((c: any) => c.author.login))], // 去重
      questioner: discussion.author.login,
      questionerActivity: null, 
      views: discussion.views || 0,
      status: discussion.answerChosenAt ? "Answered" : "Unanswered",
    };
  });
}


// fetchDiscussions()
//   .then((discussions) => {
//     console.log(discussions);
//   })
//   .catch((error) => {
//     console.error("Error fetching discussions:", error);
//   });



import { DiscussionData,  DiscussionNode} from "#/lib/type";

function useFetchDiscussionJson(url: string) {
  const [data, setData] = useState<DiscussionData | undefined>();
    useEffect(() => {
      d3.json(url)
        .then((d) => {
          setData(d as DiscussionData);
        })
        .catch((error) => console.error("Load Error:", error));
    }, []);
    return data
}


function sortDiscussionsByUniqueCommenters(data: DiscussionData): DiscussionNode[] {
  return data.data.repository.discussions.edges
    .map(edge => edge.node)
    .sort((a, b) => {
      const uniqueA = new Set(a.comments.edges.map(c => c.node.author.login)).size;
      const uniqueB = new Set(b.comments.edges.map(c => c.node.author.login)).size;
      return uniqueB - uniqueA;
    });
}

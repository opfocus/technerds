export interface DataPoint {
  category: string;
  group1: number;
  group2: number;
}

export type chatSizeProps = {
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

export interface DiscussionData {
  data: {
    repository: {
      discussions: {
        edges: DiscussionEdge[];
      };
    };
  };
}

interface DiscussionEdge {
  node: DiscussionNode;
}

export interface DiscussionNode {
  id: string;
  title: string;
  url: string;
  category: {
    name: string;
  };
  createdAt: string;
  closedAt: string | null;
  answerChosenAt: string | null;
  answer: {
    author: {
      login: string;
    };
  } | null;
  author: {
    login: string;
  };
  comments: {
    edges: CommentEdge[];
  };
}

interface CommentEdge {
  node: CommentNode;
}

interface CommentNode {
  author: {
    login: string;
  };
  createdAt: string;
}

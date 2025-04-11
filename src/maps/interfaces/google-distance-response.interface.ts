export interface GoogleDistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      status: string;
      distance?: {
        text: string;
        value: number;
      };
    }>;
  }>;
  status: string;
}

export class OpenAIResponse {
  id!: string;
  model!: string;
  choices!: [
    {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    },
  ];
}

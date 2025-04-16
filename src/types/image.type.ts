export type CreateImageUrlPayload = {
  referenceId: number;
  imageUsage: "POST";
  imageExtensions: string[];
};

export type UploadComplateImagePayload = {
  referenceId: number;
  imageUsage: "POST";
  imageUrls: string[];
};

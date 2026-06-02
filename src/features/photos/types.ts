export interface Photo {
  id: string;
  contestId: string;
  authorId: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
}

export interface CreatePhotoInput {
  contestId: string;
  title: string;
  description?: string;
  imageUrl: string;
}

export interface PhotoContextValue {
  photos: Photo[];
  getPhotosByContest: (contestId: string) => Photo[];
  getUserPhotosCount: (contestId: string, userId: string) => number;
  submitPhoto: (input: CreatePhotoInput) => Photo;
}

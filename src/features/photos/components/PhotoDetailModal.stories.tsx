import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import PhotoDetailModal from './PhotoDetailModal';
import { anonymizePhoto, type Photo } from '@/features/photos';
import type { Contest } from '@/features/contests';
import { isoDaysAgo } from '@/shared/utils/dateUtils';

const meta = {
  component: PhotoDetailModal,
  tags: ['ai-generated', 'autodocs'],
} satisfies Meta<typeof PhotoDetailModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const basePhoto: Photo = {
  id: 'photo-1',
  contestId: 'contest-1',
  authorId: 'user-2', // → getUserName résout "Bob"
  title: 'Coucher de soleil',
  description: 'Un coucher de soleil photographié depuis la plage, avec des couleurs très vives.',
  imageUrl: 'https://placehold.co/900x600',
  createdAt: isoDaysAgo(1),
};

const baseContest = {
  id: 'contest-1',
  name: 'Concours de paysages',
  authorId: 'user-1',
  submissionDays: 7,
  voteDays: 7,
  photos: [],
};

const submissionContest: Contest = {
  ...baseContest,
  id: 'contest-submission',
  name: 'Concours en cours de soumission',
  createdAt: isoDaysAgo(0),
};

const voteContest: Contest = {
  ...baseContest,
  id: 'contest-vote',
  name: 'Concours en phase de vote',
  createdAt: isoDaysAgo(8), // fenêtre de soumission (7j) déjà passée
};

const closedContest: Contest = {
  ...baseContest,
  id: 'contest-closed',
  name: 'Concours clos',
  createdAt: isoDaysAgo(30), // soumission (7j) + vote (7j) déjà passés
};

export const SubmissionPhase: Story = {
  args: {
    photo: { ...basePhoto, id: 'photo-submission', title: 'Photo en soumission' },
    contest: submissionContest,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText('Photo en soumission')).toBeVisible();
    await expect(body.getByText('Bob')).toBeVisible();
  },
};

export const VotePhase: Story = {
  args: {
    photo: anonymizePhoto({ ...basePhoto, id: 'photo-vote', title: 'Photo en vote' }),
    contest: voteContest,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText('Photo en vote')).toBeVisible();
    await expect(body.queryByText('Auteur')).not.toBeInTheDocument();
    await expect(body.getByRole('img')).toBeVisible();
  },
};

export const ClosedWithResults: Story = {
  args: {
    photo: { ...basePhoto, id: 'photo-closed', title: 'Photo gagnante' },
    contest: closedContest,
    onClose: () => {},
    averageRating: 4.2,
    isWinner: true,
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText('Photo gagnante')).toBeVisible();
    await expect(body.getByText('Bob')).toBeVisible();
    await expect(body.getByText('4.2/5')).toBeVisible();
    await expect(body.getByText('photo gagnante')).toBeVisible();
  },
};

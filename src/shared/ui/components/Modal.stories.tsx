import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { within } from 'storybook/test';
import Modal from './Modal';

const meta = {
  component: Modal,
  tags: ['ai-generated'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Modal Title',
    children: <p>Modal content goes here</p>,
  },
  play: async ({ canvasElement }) => {
    // Modal uses createPortal with document.body, so we need to query the document
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByText('Modal Title')).toBeVisible();
    await expect(body.getByText('Modal content goes here')).toBeVisible();
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    title: 'Closed Modal',
    children: <p>This should not be visible</p>,
  },
};

export const WithLongContent: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Long Content',
    children: (
      <div>
        <p>This is a modal with longer content.</p>
        <p>It should have a scrollable area if it exceeds the max height.</p>
        <p>Line 1</p>
        <p>Line 2</p>
        <p>Line 3</p>
      </div>
    ),
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import Bowling from './Bowling';

const meta: Meta<typeof Bowling> = {
  component: Bowling,
  title: 'Bowling',
};

type Story = StoryObj<typeof Bowling>;

export default meta;

const checkScore = async (canvasElement: HTMLElement, correctScore: number) => {
  const canvas = within(canvasElement);

  const playButton = canvas.getByText('Spiel');
  let score = await canvas.queryByText(`Score: ${correctScore}`);
  expect(score).toBeFalsy();

  await userEvent.click(playButton);

  score = await canvas.queryByText(`Score: ${correctScore}`);
  expect(score).toBeTruthy();
};

export const Component: Story = {
  args: {
    initialRolls: '9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0,9,0',
  },
};

export const TwelveTimesStrike: Story = {
  args: {
    initialRolls:
      '10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0',
  },
  play: async ({ canvasElement }) => {
    checkScore(canvasElement, 300);
  },
};

export const TenTimesNineZero: Story = {
  args: {
    initialRolls: '9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0',
  },
  play: async ({ canvasElement }) => {
    checkScore(canvasElement, 90);
  },
};

export const TwentyoneTimesFive: Story = {
  args: {
    initialRolls:
      '5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5',
  },
  play: async ({ canvasElement }) => {
    checkScore(canvasElement, 150);
  },
};

export const TenTimesZeroTenAndFive: Story = {
  args: {
    initialRolls:
      '0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 0, 10, 5',
  },
  play: async ({ canvasElement }) => {
    checkScore(canvasElement, 105);
  },
};

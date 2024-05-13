import { AccountModel } from '@/domain/models/account.model';

export const mockAcctountE2E = {
  name: 'Maisson',
  document: '999999999',
} as AccountModel;

export const mockAcctount = {
  id: 1,
  balance: 500,
  ...mockAcctountE2E,
} as AccountModel;

export const mockOtherAcctountE2E = {
  name: 'Maria',
  document: '888888888',
} as AccountModel;

export const mockOtherAcctount = {
  id: 2,
  balance: 800,
  ...mockOtherAcctountE2E,
} as AccountModel;

export const mockMoreOtherAcctountE2E = {
  name: 'Jose',
  document: '77777677',
} as AccountModel;

export const mockMoreOtherAcctount = {
  id: 2,
  balance: 800,
  ...mockMoreOtherAcctountE2E,
} as AccountModel;

// selectors.js
import { createSelector } from 'reselect';

export const selectTranchFilterData = (state) =>
  state.dashboard.tranchFilter.data || {};

export const selectFilterFields = createSelector(
  [selectTranchFilterData],
  (data) => ({
    fromInterest: data.fromInterest,
    toInterest: data.toInterest,
    currency: data.currency,
    industry: data.industry,
    earlyRedemptionFrequency: data.EarlyRedemptionFrequency,
    country: data.country,
    dealStatus: data.dealStatus,
    creditRating: data.creditRating,
  })
);

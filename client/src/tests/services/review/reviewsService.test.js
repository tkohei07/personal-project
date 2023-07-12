import reviewsService from '../../../services/reviewsService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe('reviewsService', () => {
  it('adds review', async () => {
    const reviewObject = {
      buildingId: 1,
      userId: 1,
      rating: 5,
      comment: "Great place!"
    };
    const mockResponse = {};

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    await reviewsService.addReview(reviewObject.buildingId, reviewObject.userId, reviewObject.rating, reviewObject.comment);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/add-review/${reviewObject.buildingId}`, expect.any(Object));
  });

  it('throws error when adding review fails', async () => {
    const reviewObject = {
      buildingId: 1,
      userId: 1,
      rating: 5,
      comment: "Great place!"
    };

    fetch.mockRejectOnce(new Error('Failed to add review'));

    await expect(reviewsService.addReview(reviewObject.buildingId, reviewObject.userId, reviewObject.rating, reviewObject.comment)).rejects.toThrow('Failed to add review');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/add-review/${reviewObject.buildingId}`, expect.any(Object));
  });

  it('fetches reviews by buildingId', async () => {
    const buildingId = 1;
    const mockResponse = [{id: 1, comment: 'Great place!'}];

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const reviews = await reviewsService.fetchReviewsByBuildingId(buildingId);

    expect(reviews).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/reviews/${buildingId}`);
  });

  it('throws error when fetching reviews by buildingId fails', async () => {
    const buildingId = 1;

    fetch.mockRejectOnce(new Error('Failed to fetch reviews'));

    await expect(reviewsService.fetchReviewsByBuildingId(buildingId)).rejects.toThrow('Failed to fetch reviews');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/reviews/${buildingId}`);
  });

  it('fetches reviews by userId', async () => {
    const userId = 1;
    const mockResponse = [{id: 1, comment: 'Great place!'}];

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const reviews = await reviewsService.fetchReviewsByUserId(userId);

    expect(reviews).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/reviews`);
  });

  it('throws error when fetching reviews by userId fails', async () => {
    const userId = 1;

    fetch.mockRejectOnce(new Error('Failed to fetch reviews'));

    await expect(reviewsService.fetchReviewsByUserId(userId)).rejects.toThrow('Failed to fetch reviews');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/reviews`);
  });

  it('deletes review', async () => {
    const reviewId = 1;

    fetch.mockResponseOnce(JSON.stringify({}));

    await reviewsService.deleteReview(reviewId);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/review/${reviewId}`, expect.any(Object));
  });

  it('throws error when deleting review fails', async () => {
    const reviewId = 1;

    fetch.mockRejectOnce(new Error('Failed to delete review'));

    await expect(reviewsService.deleteReview(reviewId)).rejects.toThrow('Failed to delete review');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/review/${reviewId}`, expect.any(Object));
  });
});

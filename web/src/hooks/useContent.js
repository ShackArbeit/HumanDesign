import { useQuery } from '@tanstack/react-query';
import { fetchAboutTimeline, fetchContent, fetchFeedbackVideos } from '../api/content';
import { queryKeys } from '../lib/queryKeys';

const CONTENT_STALE_MS = 5 * 60 * 1000;

export const useContent = (section) =>
  useQuery({
    queryKey: queryKeys.content(section),
    queryFn: () => fetchContent(section),
    staleTime: CONTENT_STALE_MS,
  });

export const useAboutTimeline = () =>
  useQuery({
    queryKey: queryKeys.aboutTimeline,
    queryFn: fetchAboutTimeline,
    staleTime: CONTENT_STALE_MS,
  });

export const useFeedbackVideos = () =>
  useQuery({
    queryKey: queryKeys.feedbackVideos,
    queryFn: fetchFeedbackVideos,
    staleTime: CONTENT_STALE_MS,
  });

import {
  highlightFirstVideo,
  highlightFourthVideo,
  highlightSecondVideo,
  highlightThirdVideo,
} from "../utils";

export const hightlightsSlides = [
  {
    id: 1,
    textLists: [
      "Step into Comfort.",
      "Premium Materials.",
      "Unmatched Style.",
    ],
    video: highlightFirstVideo,
    videoDuration: 4,
  },
  {
    id: 2,
    textLists: ["Lightweight Design.", "Built for Performance."],
    video: highlightSecondVideo,
    videoDuration: 5,
  },
  {
    id: 3,
    textLists: [
      "From the Streets",
      "to the Runways.",
      "Made for You.",
    ],
    video: highlightThirdVideo,
    videoDuration: 2,
  },
  {
    id: 4,
    textLists: ["New Season. New Collection.", "Discover More."],
    video: highlightFourthVideo,
    videoDuration: 3.63,
  },
];
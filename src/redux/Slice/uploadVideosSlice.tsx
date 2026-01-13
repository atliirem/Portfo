import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UploadedVideo {
  id: number;
  path: string;     
  cover: string;   
}


export interface VideosState {
  local: Record<string, string[]>;              
  uploaded: Record<string, UploadedVideo[]>;    
}

const initialState: VideosState = {
  local: {},
  uploaded: {},
};

const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {

  addLocalVideo: (
  state,
  action: PayloadAction<{ category: string; uri: string }>
) => {
  const { category, uri } = action.payload;

  if (!state.local[category]) state.local[category] = [];
  state.local[category].push(uri);
},

    removeLocalVideo: (
      state,
      action: PayloadAction<{ category: string; index: number }>
    ) => {
      const { category, index } = action.payload;
      state.local[category]?.splice(index, 1);
    },

    
    addUploadedVideo: (
      state,
      action: PayloadAction<{ category: string; data: UploadedVideo }>
    ) => {
      const { category, data } = action.payload;

      if (!state.uploaded[category]) state.uploaded[category] = [];
      state.uploaded[category].push(data);
    },


    clearVideoCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      state.local[category] = [];
      state.uploaded[category] = [];
    },

  
    clearAllVideos: (state) => {
      state.local = {};
      state.uploaded = {};
    },
  },
});

export const {
  addLocalVideo,
  removeLocalVideo,
  addUploadedVideo,
  clearVideoCategory,
  clearAllVideos,
} = videosSlice.actions;

export default videosSlice.reducer;

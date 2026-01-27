import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../../api/CreateThunk";

export interface GalleryImage {
  id: number;
  path: {
    small: string;
    large?: string;
  };
}

export interface GalleryCategory {
  id: number;
  title: string;
  images: GalleryImage[];
}

interface GalleryState {
  categories: GalleryCategory[];
  coverImage: string | null;
  loading: boolean;
  uploading: boolean;
  uploadingCover: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: GalleryState = {
  categories: [],
  coverImage: null,
  loading: false,
  uploading: false,
  uploadingCover: false,
  deleting: false,
  error: null,
};

export const uploadGalleryImage = createAsyncThunk(
  "gallery/upload",
  async (
    { propertyId, categoryId, asset }: { propertyId: number; categoryId: number; asset: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      const fileName = asset.fileName || asset.uri?.split("/").pop() || "photo.jpg";
      const fileType = asset.type || "image/jpeg";

      formData.append("file", {
        uri: asset.uri,
        name: fileName,
        type: fileType,
      } as any);

      formData.append("category_id", String(categoryId));

      console.log("📤 Upload - Property:", propertyId, "Category:", categoryId);

      const res = await api.post(
        `/properties/${propertyId}/galleries/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("📤 Upload response:", res.data);

      if (res.data.status === "success") {
        return {
          categoryId,
          image: res.data.data,
        };
      }

      return rejectWithValue(res.data.message || "Yüklenemedi");
    } catch (error: any) {
      console.error("📤 Upload error:", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Yüklenemedi");
    }
  }
);

export const uploadCoverImage = createAsyncThunk(
  "gallery/uploadCover",
  async (
    { propertyId, asset }: { propertyId: number; asset: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      const fileName = asset.fileName || asset.uri?.split("/").pop() || "cover.jpg";
      const fileType = asset.type || "image/jpeg";

      formData.append("cover", {
        uri: asset.uri,
        name: fileName,
        type: fileType,
      } as any);

      console.log("📤 Cover Upload - Property:", propertyId);

      const res = await api.post(
        `/properties/${propertyId}/galleries/cover/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Cover Upload response:", res.data);

      if (res.data.status === "success") {
        return {
          path: res.data.data.path,
        };
      }

      return rejectWithValue(res.data.message || "Kapak fotoğrafı yüklenemedi");
    } catch (error: any) {
      console.error("📤 Cover Upload error:", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Kapak fotoğrafı yüklenemedi");
    }
  }
);

// Galeri sil
export const deleteGalleryImage = createAsyncThunk(
  "gallery/delete",
  async (
    { propertyId, imageId }: { propertyId: number; imageId: number },
    { rejectWithValue }
  ) => {
    try {
      console.log("🗑️ Delete - Property:", propertyId, "Image:", imageId);

      const res = await api.post(`/properties/${propertyId}/galleries/delete`, {
        image_id: imageId,
      });

      console.log("🗑️ Delete response:", res.data);

      if (res.data.status === "success") {
        return { imageId };
      }

      return rejectWithValue(res.data.message || "Silinemedi");
    } catch (error: any) {
      console.error("🗑️ Delete error:", error?.response?.data);
      return rejectWithValue(error?.response?.data?.message || "Silinemedi");
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setGalleryCategories: (state, action: PayloadAction<GalleryCategory[]>) => {
      state.categories = action.payload;
    },

    setCoverImage: (state, action: PayloadAction<string | null>) => {
      state.coverImage = action.payload;
    },

    clearGallery: (state) => {
      state.categories = [];
      state.coverImage = null;
      state.error = null;
    },

    clearGalleryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload
    builder
      .addCase(uploadGalleryImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadGalleryImage.fulfilled, (state, action) => {
        state.uploading = false;

        const { categoryId, image } = action.payload;

        const category = state.categories.find((c) => c.id === categoryId);
        if (category && image) {
          const newImage: GalleryImage = {
            id: image.id,
            path: {
              small: image.small_path || image.path,
              large: image.path,
            },
          };
          category.images.push(newImage);
        }
      })
      .addCase(uploadGalleryImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });

    // Cover Upload
    builder
      .addCase(uploadCoverImage.pending, (state) => {
        state.uploadingCover = true;
        state.error = null;
      })
      .addCase(uploadCoverImage.fulfilled, (state, action) => {
        state.uploadingCover = false;
        state.coverImage = action.payload.path;
      })
      .addCase(uploadCoverImage.rejected, (state, action) => {
        state.uploadingCover = false;
        state.error = action.payload as string;
      });

    // Delete
    builder
      .addCase(deleteGalleryImage.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.deleting = false;

        const { imageId } = action.payload;

        state.categories.forEach((category) => {
          category.images = category.images.filter((img) => img.id !== imageId);
        });
      })
      .addCase(deleteGalleryImage.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { setGalleryCategories, setCoverImage, clearGallery, clearGalleryError } = gallerySlice.actions;

export default gallerySlice.reducer;
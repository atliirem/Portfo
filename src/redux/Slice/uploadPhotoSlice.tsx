import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../../api/CreateThunk";

// ==================== INTERFACES ====================

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
  loading: boolean;
  uploading: boolean;
  deleting: boolean;
  error: string | null;
}

// ==================== INITIAL STATE ====================

const initialState: GalleryState = {
  categories: [],
  loading: false,
  uploading: false,
  deleting: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

// Galeri yükle
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

// ==================== SLICE ====================

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    // Kategorileri set et (property'den)
    setGalleryCategories: (state, action: PayloadAction<GalleryCategory[]>) => {
      state.categories = action.payload;
    },

    // Kategorileri temizle
    clearGallery: (state) => {
      state.categories = [];
      state.error = null;
    },

    // Hata temizle
    clearGalleryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // UPLOAD
    builder
      .addCase(uploadGalleryImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadGalleryImage.fulfilled, (state, action) => {
        state.uploading = false;

        const { categoryId, image } = action.payload;

        // Kategoriye yeni resmi ekle
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

    // DELETE
    builder
      .addCase(deleteGalleryImage.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.deleting = false;

        const { imageId } = action.payload;

        // Tüm kategorilerden resmi kaldır
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

// ==================== EXPORTS ====================

export const { setGalleryCategories, clearGallery, clearGalleryError } = gallerySlice.actions;

export default gallerySlice.reducer;
// import React, { useState } from "react";
// import { View, Button, Text, ActivityIndicator } from "react-native";
// // import DocumentPicker, { types } from "react-native-document-picker";

// const FileUpload = () => {
//   const [file, setFile] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const pickFile = async () => {
//     try {
//       const result = await DocumentPicker.pick({
//         type: [types.allFiles], 
//       });

//       setFile(result[0]); 
//       console.log("Seçilen dosya:", result[0]);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log("Kullanıcı iptal etti");
//       } else {
//         console.error(err);
//       }
//     }
//   };

//   const uploadFile = async () => {
//     if (!file) return;

//     setLoading(true);

//     const formData = new FormData();

//     formData.append("file", {
//       uri: file.uri,
//       type: file.type || "application/octet-stream",
//       name: file.name,
//     } as any);

//     try {
//       const response = await fetch("https://your-backend-url/upload", {
//         method: "POST",
//         body: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const json = await response.json();
//       console.log("Upload sonucu:", json);
//     } catch (e) {
//       console.error("Upload hatası:", e);
//     }

//     setLoading(false);
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Button title="Dosya Seç" onPress={pickFile} />

//       {file && (
//         <Text style={{ marginTop: 10 }}>
//           Seçilen: {file.name} ({file.size} bytes)
//         </Text>
//       )}

//       <View style={{ marginTop: 20 }}>
//         {loading ? (
//           <ActivityIndicator size="large" color="blue" />
//         ) : (
//           <Button title="Upload Et" onPress={uploadFile} />
//         )}
//       </View>
//     </View>
//   );
// };

// export default FileUpload;

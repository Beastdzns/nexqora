package com.example.nexqora_ait.welcome

import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.util.ImageUploadStage
import com.google.firebase.storage.FirebaseStorage

@Composable
fun UploadImageScreen(
    imageUploadStage: ImageUploadStage,
    userID: String,
    onComplete: () -> Unit,
    imageUrl: (String) -> Unit
) {
    val context = LocalContext.current
    var imageUri by remember { mutableStateOf<Uri?>(null) }
    var uploadProgress by remember { mutableStateOf(0f) }
    var isUploading by remember { mutableStateOf(false) }
    var uploadedUrl by remember { mutableStateOf<String?>(null) }

    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        imageUri = uri
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {

        Text(if (imageUploadStage == ImageUploadStage.AADHAR) "Select Aadhar Image" else "Select Pan Card", color = ThemeColors.TextColor)

        if (imageUri != null) {
            Image(
                painter = rememberAsyncImagePainter(imageUri),
                contentDescription = "Selected Image",
                modifier = Modifier
                    .size(200.dp)
                    .clip(RoundedCornerShape(10.dp))
            )
        } else {
            Text(text = "No Image Selected", color = Color.Gray)
        }

        Spacer(modifier = Modifier.height(20.dp))

        Button(onClick = { imagePickerLauncher.launch("image/*") }) {
            Text("Select Image")
        }

        Spacer(modifier = Modifier.height(20.dp))

        if (imageUri != null) {
            Button(
                onClick = {
                    uploadImageToFirebase(
                        imageUri = imageUri!!,
                        userID = userID,
                        imageUploadStage = imageUploadStage
                    ) { url, progress ->
                        uploadProgress = progress
                        if (url != null) {
                            uploadedUrl = url
                            imageUrl(url)
                            isUploading = false
                            Toast.makeText(context, "Upload Successful!", Toast.LENGTH_SHORT).show()
                            onComplete()
                        }
                    }
                    isUploading = true
                },
                enabled = !isUploading
            ) {
                Text("Upload")
            }

            Spacer(modifier = Modifier.height(10.dp))

            if (isUploading) {
                LinearProgressIndicator(progress = uploadProgress)
                Spacer(modifier = Modifier.height(10.dp))
                Text(text = "Uploading: ${(uploadProgress * 100).toInt()}%")
            }
        }

        if (imageUploadStage == ImageUploadStage.PAN_CARD) {
            Button(onClick = {
                onComplete()
                imageUrl("")
            }) {
                Text("Skip")
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        uploadedUrl?.let {
            Text(text = "Download URL: $it", color = Color.Green)
        }
    }
}

fun uploadImageToFirebase(
    imageUri: Uri,
    userID: String,
    imageUploadStage: ImageUploadStage,
    onComplete: (String?, Float) -> Unit
) {
    val storageRef = FirebaseStorage.getInstance().reference
    val fileName = "/verification/images/$userID/${
        when (imageUploadStage) {
            ImageUploadStage.AADHAR -> "aadhar"; ImageUploadStage.PAN_CARD -> "pan"
        }
    }.jpg"
    val fileRef = storageRef.child(fileName)

    fileRef.putFile(imageUri)
        .addOnProgressListener { taskSnapshot ->
            val progress = taskSnapshot.bytesTransferred.toFloat() / taskSnapshot.totalByteCount
            onComplete(null, progress)
        }
        .addOnSuccessListener {
            fileRef.downloadUrl.addOnSuccessListener { uri ->
                onComplete(uri.toString(), 1f)
            }
        }
        .addOnFailureListener {
            onComplete(null, 0f)
        }
}

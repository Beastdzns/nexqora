package com.example.nexqora_ait.welcome

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.example.nexqora_ait.data.VerificationDetails
import com.example.nexqora_ait.ui.components.mainLayoutDefaults
import com.example.nexqora_ait.util.ImageUploadStage
import com.example.nexqora_ait.viewmodel.MainViewModel
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import kotlinx.serialization.Serializable

@Serializable
object UploadFilesScreen

@Composable
fun UploadFilesScreen(
    navController: NavController,
    mainViewModel: MainViewModel
) {

    val mAuth = FirebaseAuth.getInstance()
    val user: FirebaseUser = mAuth.currentUser!!

    var imageUploadStage by remember {
        mutableStateOf(ImageUploadStage.AADHAR)
    }

    var aadharImageUrl by rememberSaveable {
        mutableStateOf("")
    }

    Column(
        modifier = Modifier.mainLayoutDefaults(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        when(imageUploadStage) {
            ImageUploadStage.AADHAR -> {
                UploadImageScreen(
                    imageUploadStage = ImageUploadStage.AADHAR,
                    userID = user.uid,
                    onComplete = {
                        imageUploadStage = ImageUploadStage.PAN_CARD
                    },
                    imageUrl = {
                       aadharImageUrl = it
                    }
                )
            }
            ImageUploadStage.PAN_CARD -> {
                UploadImageScreen(
                    imageUploadStage = ImageUploadStage.PAN_CARD,
                    userID = user.uid,
                    onComplete = {

                    },
                    imageUrl = {
                        mainViewModel.addVerificationImages(
                            verificationDetails = VerificationDetails(
                                userID = user.uid,
                                aadharImage = aadharImageUrl,
                                panImage = it
                            ),
                            success = {
                                navController.navigate(WelcomeScreen)
                            }
                        )
                    }
                )
            }
        }
    }



}
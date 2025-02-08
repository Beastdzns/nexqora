package com.example.nexqora_ait.welcome

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowForward
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.nexqora_ait.data.ProfileDetails
import com.example.nexqora_ait.ui.components.mainLayoutDefaults
import com.example.nexqora_ait.ui.theme.SMALL
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.util.sha256
import com.example.nexqora_ait.viewmodel.MainViewModel
import kotlinx.serialization.Serializable

@Serializable
object CreateProfileScreen

@Composable
fun CreateProfileScreen(
    navController: NavController,
    mainViewModel: MainViewModel
) {

    var profileDetails by remember {
        mutableStateOf(ProfileDetails())
    }

    val context = LocalContext.current

    var loading by remember {
        mutableStateOf(false)
    }

    Column(
        modifier = Modifier.mainLayoutDefaults(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        OutlinedTextField(
            value = profileDetails.name,
            onValueChange = {
                profileDetails = profileDetails.copy(name = it)
            },
            label = {
                Text("Name", color = ThemeColors.TextColor)
            }
        )

        Spacer(modifier = Modifier.height(10.dp))

        OutlinedTextField(
            value = profileDetails.mobileNo,
            onValueChange = {
                profileDetails = profileDetails.copy(mobileNo = it)
            },
            label = {
                Column {
                    Text("Mobile No", color = ThemeColors.TextColor)
                }
            }
        )
        Text(
            "(including country code)",
            color = ThemeColors.TextColorPurple,
            fontSize = SMALL
        )

        Spacer(modifier = Modifier.height(10.dp))

        OutlinedTextField(
            value = profileDetails.aadharCardHash,
            onValueChange = {
                profileDetails = profileDetails.copy(aadharCardHash = it)
            },
            label = {
                Text("Aadhar Card Number", color = ThemeColors.TextColor)

            }
        )
        Text(
            "(No worries! it will be encrypted!)",
            color = ThemeColors.TextColorPurple,
            fontSize = SMALL
        )

        Spacer(modifier = Modifier.height(10.dp))

        OutlinedTextField(
            value = profileDetails.panCard,
            onValueChange = {
                profileDetails = profileDetails.copy(panCard = it)
            },
            label = {
                Text("PAN Card Number (Optional)", color = ThemeColors.TextColor)
            }
        )
        Text(
            "(No worries! it will be encrypted!)",
            color = ThemeColors.TextColorPurple,
            fontSize = SMALL
        )

        Spacer(modifier = Modifier.height(30.dp))

        Button(
            onClick = {

                if (profileDetails.name.isNotEmpty() &&
                    profileDetails.mobileNo.isNotEmpty() &&
                    profileDetails.aadharCardHash.length == 12
                ) {
                    loading = true
                    mainViewModel.createProfile(
                        profileDetails = profileDetails.copy(
                            aadharCardHash = profileDetails.aadharCardHash.sha256(),
                            panCard = if (profileDetails.panCard.length == 10) profileDetails.panCard.sha256() else ""
                        ),
                        success = {
                            loading = false
                            navController.navigate(UploadFilesScreen)
                        }
                    )
                } else {
                    Toast.makeText(context, "Please fill all details!", Toast.LENGTH_LONG).show()
                }

            }
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Confirm", modifier = Modifier.padding(end = 10.dp),)
                if (loading) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp), color = ThemeColors.BackgroundColor)
                } else {
                    Icon(
                        imageVector = Icons.Rounded.ArrowForward,
                        contentDescription = ""
                    )
                }
            }
        }

    }

}
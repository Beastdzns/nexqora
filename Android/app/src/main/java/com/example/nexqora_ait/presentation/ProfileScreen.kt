package com.example.nexqora_ait.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.nexqora_ait.ui.components.mainLayoutDefaults
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.viewmodel.MainViewModel
import kotlinx.serialization.Serializable

@Serializable
object ProfileScreen

@Composable
fun ProfileScreen(
    navController: NavController,
    mainViewModel: MainViewModel
) {

    mainViewModel.getProfileDetails()

    val profileDetails by mainViewModel.profileDetails.collectAsState()

    Column(
        modifier = Modifier.mainLayoutDefaults(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        OutlinedTextField(
            value = profileDetails.name,
            onValueChange = {

            }, enabled = false,
            label = {
                Text("Name", color = ThemeColors.TextColor)
            },
            colors = OutlinedTextFieldDefaults.colors(
                disabledTextColor = ThemeColors.TextColor,
                disabledBorderColor = ThemeColors.TextColor
            )
        )

        Spacer(modifier = Modifier.height(30.dp))

        OutlinedTextField(
            value = profileDetails.mobileNo,
            onValueChange = {

            }, enabled = false,
            label = {
                Text("Mobile No", color = ThemeColors.TextColor)
            },
            colors = OutlinedTextFieldDefaults.colors(
                disabledTextColor = ThemeColors.TextColor,
                disabledBorderColor = ThemeColors.TextColor
            )
        )

        Spacer(modifier = Modifier.height(30.dp))

        OutlinedTextField(
            modifier = Modifier.padding(horizontal = 30.dp),
            value = profileDetails.aadharCardHash,
            onValueChange = {

            }, enabled = false,
            label = {
                Text("Aadhar Card Number", color = ThemeColors.TextColor)
            },
            colors = OutlinedTextFieldDefaults.colors(
                disabledTextColor = ThemeColors.TextColor,
                disabledBorderColor = ThemeColors.TextColor
            )
        )

        Spacer(modifier = Modifier.height(30.dp))

        OutlinedTextField(
            value = profileDetails.panCard,
            onValueChange = {

            }, enabled = false,
            label = {
                Text("PAN Card Number", color = ThemeColors.TextColor)
            },
            colors = OutlinedTextFieldDefaults.colors(
                disabledTextColor = ThemeColors.TextColor,
                disabledBorderColor = ThemeColors.TextColor
            )
        )

        Spacer(modifier = Modifier.height(50.dp))

        Button(
            onClick = {
                navController.popBackStack()
            }
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Rounded.ArrowBack,
                    contentDescription = "",
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text("Back")
            }
        }

    }

}
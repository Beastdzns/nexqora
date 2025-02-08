package com.example.nexqora_ait.welcome

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.example.nexqora_ait.ui.components.mainLayoutDefaults
import com.example.nexqora_ait.ui.theme.ThemeColors
import com.example.nexqora_ait.viewmodel.MainViewModel
import kotlinx.serialization.Serializable

@Serializable
object UnverifiedScreen

@Composable
fun UnverifiedScreen(
    navController: NavController,
    mainViewModel: MainViewModel
) {

    Column(
        modifier = Modifier.mainLayoutDefaults(),
         verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Text("User not Verified till now!", color = ThemeColors.TextColor)

    }

}
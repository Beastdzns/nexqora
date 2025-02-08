package com.example.nexqora_ait.welcome

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.example.nexqora_ait.ui.components.mainLayoutDefaults
import kotlinx.serialization.Serializable

@Serializable
object WelcomeScreen

@Composable
fun WelcomeScreen(
    navController: NavController
) {

    Column(
        modifier = Modifier.mainLayoutDefaults(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Text("Welcome!!!")

    }

}
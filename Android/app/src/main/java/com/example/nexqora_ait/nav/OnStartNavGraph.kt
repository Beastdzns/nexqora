package com.example.nexqora_ait.nav

import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavHostController
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.example.nexqora_ait.presentation.bottom_nav.HomeScreen
import com.example.nexqora_ait.presentation.bottom_nav.screens.HomeScreen
import com.example.nexqora_ait.viewmodel.MainViewModel
import com.example.nexqora_ait.welcome.CreateProfileScreen
import com.example.nexqora_ait.welcome.SplashScreen
import com.example.nexqora_ait.welcome.UnverifiedScreen
import com.example.nexqora_ait.welcome.UploadFilesScreen
import com.example.nexqora_ait.welcome.WelcomeScreen

const val splashScreenRoute = "splash_screen"

fun NavGraphBuilder.onStartNavGraph(
    navController: NavHostController,
    mainViewModel: MainViewModel
) {

    navigation(
        route = Graph.ON_START_NAV_GRAPH,
        startDestination = splashScreenRoute
    ) {

        composable(splashScreenRoute) {
            SplashScreen(navController = navController, mainViewModel = mainViewModel)
        }

        composable<SplashScreen> {
            SplashScreen(navController = navController, mainViewModel = mainViewModel)
        }

        composable<HomeScreen> {
            HomeScreen(navController = navController)
        }

        composable<WelcomeScreen> {
            WelcomeScreen(navController = navController)
        }

        composable<UploadFilesScreen> {
            UploadFilesScreen(navController = navController, mainViewModel = mainViewModel)
        }

        composable<CreateProfileScreen> {
            CreateProfileScreen(navController = navController, mainViewModel = mainViewModel)
        }

        composable<UnverifiedScreen> {
            UnverifiedScreen(navController = navController, mainViewModel = mainViewModel)
        }

    }

}
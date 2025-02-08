package com.example.nexqora_ait.presentation.bottom_nav.navigation

import com.example.nexqora_ait.presentation.bottom_nav.utility.BottomNavImages

sealed class BottomNavRoute(
    val route: String,
    val title: String,
    val icon: Int,
) {

    // for home
    data object Home : BottomNavRoute(
        route = BottomNavigationRoutes.HOME,
        title = "",
        icon = BottomNavImages.home,
    )

    // for trade
    data object Trade : BottomNavRoute(
        route = BottomNavigationRoutes.TRADE,
        title = "",
        icon = BottomNavImages.globe,
    )

    // for Withdrawal
    data object Withdrawal : BottomNavRoute(
        route = BottomNavigationRoutes.WITHDRAW,
        title = "",
        icon = BottomNavImages.withdrawal,
    )

    // for Sentiments
    data object Sentiments : BottomNavRoute(
        route = BottomNavigationRoutes.SENTIMENTS,
        title = "",
        icon = BottomNavImages.trend,
    )

    // for Portfolio
    data object Portfolio : BottomNavRoute(
        route = BottomNavigationRoutes.PORTFOLIO,
        title = "",
        icon = BottomNavImages.portfolio,
    )

}

object BottomNavigationRoutes {

    const val HOME = "home"
    const val TRADE = "trade"
    const val WITHDRAW = "withdrawal"
    const val SENTIMENTS = "sentiments"
    const val PORTFOLIO = "portfolio"

}
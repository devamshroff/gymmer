import SwiftUI
import GoogleSignIn

@main
struct GYMMERApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        UIScrollView.appearance().contentInsetAdjustmentBehavior = .never
        let tabAppearance = UITabBarAppearance()
        tabAppearance.configureWithOpaqueBackground()
        tabAppearance.backgroundColor = UIColor(Theme.background)
        tabAppearance.stackedLayoutAppearance.normal.iconColor = UIColor(Theme.textMuted)
        tabAppearance.stackedLayoutAppearance.normal.titleTextAttributes = [
            .foregroundColor: UIColor(Theme.textMuted)
        ]
        tabAppearance.stackedLayoutAppearance.selected.iconColor = UIColor(Theme.accent)
        tabAppearance.stackedLayoutAppearance.selected.titleTextAttributes = [
            .foregroundColor: UIColor(Theme.accent)
        ]
        UITabBar.appearance().standardAppearance = tabAppearance
        UITabBar.appearance().scrollEdgeAppearance = tabAppearance

        let navAppearance = UINavigationBarAppearance()
        navAppearance.configureWithOpaqueBackground()
        navAppearance.backgroundColor = UIColor(Theme.background)
        navAppearance.titleTextAttributes = [
            .foregroundColor: UIColor(Theme.textPrimary)
        ]
        navAppearance.largeTitleTextAttributes = [
            .foregroundColor: UIColor(Theme.textPrimary)
        ]
        UINavigationBar.appearance().standardAppearance = navAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = navAppearance
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

final class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        return GIDSignIn.sharedInstance.handle(url)
    }
}

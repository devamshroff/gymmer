import SwiftUI

enum Theme {
    static let background = Color(hex: "#18181B") // zinc-900
    static let surface = Color(hex: "#27272A") // zinc-800
    static let surfaceElevated = Color(hex: "#1F1F23")
    static let border = Color(hex: "#3F3F46") // zinc-700
    static let textPrimary = Color.white
    static let textSecondary = Color(hex: "#A1A1AA") // zinc-400
    static let textMuted = Color(hex: "#71717A") // zinc-500
    static let accent = Color(hex: "#10B981") // emerald-500
    static let accentSoft = Color(hex: "#34D399") // emerald-400
}

extension Color {
    init(hex: String) {
        var hexString = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        if hexString.count == 3 {
            let chars = Array(hexString)
            hexString = String([chars[0], chars[0], chars[1], chars[1], chars[2], chars[2]])
        }

        var intValue: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&intValue)
        let a, r, g, b: UInt64
        switch hexString.count {
        case 8:
            a = (intValue >> 24) & 0xFF
            r = (intValue >> 16) & 0xFF
            g = (intValue >> 8) & 0xFF
            b = intValue & 0xFF
        default:
            a = 0xFF
            r = (intValue >> 16) & 0xFF
            g = (intValue >> 8) & 0xFF
            b = intValue & 0xFF
        }

        self.init(
            .sRGB,
            red: Double(r) / 255.0,
            green: Double(g) / 255.0,
            blue: Double(b) / 255.0,
            opacity: Double(a) / 255.0
        )
    }
}

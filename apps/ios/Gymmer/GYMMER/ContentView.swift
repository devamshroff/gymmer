import SwiftUI
import Combine
import GoogleSignIn
import GoogleSignInSwift

private enum AppConfig {
    static let baseURL = URL(string: "http://192.168.1.192:3000")!
}

@MainActor
final class AuthViewModel: ObservableObject {
    @Published private(set) var user: GIDGoogleUser?
    @Published private(set) var appToken: String?
    @Published var isRestoring = true

    var isSignedIn: Bool { user != nil }
    var idToken: String? { user?.idToken?.tokenString }
    var bearerToken: String? { appToken ?? idToken }

    func restorePreviousSignIn() {
        isRestoring = true
        GIDSignIn.sharedInstance.restorePreviousSignIn { [weak self] user, _ in
            self?.user = user
            Task { await self?.exchangeTokenIfPossible() }
            self?.isRestoring = false
        }
    }

    func signIn() {
        guard let root = UIApplication.shared.connectedScenes
            .compactMap({ $0 as? UIWindowScene })
            .first?.windows
            .first?.rootViewController else {
            return
        }

        GIDSignIn.sharedInstance.signIn(withPresenting: root) { [weak self] result, _ in
            self?.user = result?.user
            Task { await self?.exchangeTokenIfPossible() }
        }
    }

    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        user = nil
        appToken = nil
    }

    private func exchangeTokenIfPossible() async {
        guard let idToken = idToken else { return }
        do {
            let url = URL(string: "/api/auth/token", relativeTo: AppConfig.baseURL)!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            let body = try JSONSerialization.data(withJSONObject: ["idToken": idToken])
            request.httpBody = body

            let (data, response) = try await URLSession.shared.data(for: request)
            guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
                appToken = idToken
                return
            }
            let decoded = try JSONDecoder().decode(TokenExchangeResponse.self, from: data)
            appToken = decoded.token
        } catch {
            appToken = idToken
        }
    }
}

struct TokenExchangeResponse: Codable {
    let token: String
    let tokenType: String
    let expiresIn: Int
}

struct ContentView: View {
    @StateObject private var auth = AuthViewModel()
    @StateObject private var sessionStore = WorkoutSessionStore()
    @StateObject private var navigation = AppNavigation()

    var body: some View {
        Group {
            if auth.isRestoring {
                LoadingScreen(message: "Loading...")
            } else if auth.isSignedIn {
                MainTabView()
                    .environmentObject(auth)
                    .environmentObject(sessionStore)
                    .environmentObject(navigation)
            } else {
                LoginView()
                    .environmentObject(auth)
            }
        }
        .preferredColorScheme(.dark)
        .task {
            auth.restorePreviousSignIn()
        }
    }
}

enum AppTab: Hashable {
    case routines
    case workout
    case profile
    case analytics
}

@MainActor
final class AppNavigation: ObservableObject {
    @Published var selectedTab: AppTab = .routines
}

struct Card<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            content
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.surface)
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(Theme.border, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

enum Layout {
    static let bottomBarPadding: CGFloat = 110
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(Theme.accent.opacity(configuration.isPressed ? 0.8 : 1.0))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(Theme.textPrimary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(Theme.surfaceElevated.opacity(configuration.isPressed ? 0.8 : 1.0))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
}

struct LoginView: View {
    @EnvironmentObject private var auth: AuthViewModel

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            VStack(spacing: 24) {
                Text("GYMMER")
                    .font(.system(size: 42, weight: .bold))
                    .foregroundStyle(Theme.textPrimary)
                Text("flow and progress")
                    .foregroundStyle(Theme.textMuted)

                GoogleSignInButton {
                    auth.signIn()
                }
                .frame(height: 48)
            }
            .padding(.horizontal, 32)
        }
    }
}

struct MainTabView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var sessionStore: WorkoutSessionStore
    @EnvironmentObject private var navigation: AppNavigation

    var body: some View {
        ZStack(alignment: .bottom) {
            Group {
                switch navigation.selectedTab {
                case .routines:
                    RoutinesRootView()
                case .workout:
                    NavigationStack { ActiveWorkoutEntryView() }
                case .profile:
                    NavigationStack { ProfileView() }
                case .analytics:
                    NavigationStack { AnalyticsView() }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Theme.background)
            .ignoresSafeArea()

            CustomTabBar(selectedTab: $navigation.selectedTab)
                .padding(.bottom, 12)
        }
    }
}

struct CustomTabBar: View {
    @Binding var selectedTab: AppTab

    var body: some View {
        HStack(spacing: 28) {
            tabButton(.routines, title: "Routines", systemImage: "list.bullet")
            tabButton(.workout, title: "Workout", systemImage: "bolt.fill")
            tabButton(.profile, title: "Profile", systemImage: "person.crop.circle")
            tabButton(.analytics, title: "Analytics", systemImage: "chart.bar")
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 12)
        .background(.ultraThinMaterial, in: Capsule())
        .overlay(
            Capsule().stroke(Theme.border, lineWidth: 1)
        )
    }

    private func tabButton(_ tab: AppTab, title: String, systemImage: String) -> some View {
        Button {
            selectedTab = tab
        } label: {
            VStack(spacing: 6) {
                Image(systemName: systemImage)
                    .font(.system(size: 18, weight: .semibold))
                Text(title)
                    .font(.caption)
            }
            .foregroundStyle(selectedTab == tab ? Theme.accent : Theme.textMuted)
        }
        .buttonStyle(.plain)
    }
}

struct LoadingScreen: View {
    let message: String

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            ProgressView(message)
                .foregroundStyle(Theme.textPrimary)
        }
    }
}

// MARK: - API Client

enum APIError: Error, LocalizedError {
    case invalidURL
    case invalidResponse
    case httpError(Int, String)
    case decodingError

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid URL"
        case .invalidResponse: return "Invalid response"
        case .httpError(let code, let message): return "Request failed (\(code)): \(message)"
        case .decodingError: return "Failed to decode response"
        }
    }
}

struct APIClient {
    var baseURL = AppConfig.baseURL

    func request<T: Decodable>(
        _ path: String,
        method: String = "GET",
        body: Data? = nil,
        authToken: String?
    ) async throws -> T {
        guard let url = URL(string: path, relativeTo: baseURL) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let authToken {
            request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        }
        request.httpBody = body

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        guard (200...299).contains(http.statusCode) else {
            let message = String(data: data, encoding: .utf8) ?? ""
            throw APIError.httpError(http.statusCode, message)
        }
        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
#if DEBUG
            if path.contains("/api/routines") || path.contains("/api/workout") {
                let body = String(data: data, encoding: .utf8) ?? "<non-utf8>"
                print("Decode failed for \(path). Raw response: \(body)")
            }
#endif
            throw APIError.decodingError
        }
    }

    func requestVoid(
        _ path: String,
        method: String = "POST",
        body: Data? = nil,
        authToken: String?
    ) async throws {
        guard let url = URL(string: path, relativeTo: baseURL) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let authToken {
            request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        }
        request.httpBody = body

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        guard (200...299).contains(http.statusCode) else {
            let message = String(data: data, encoding: .utf8) ?? ""
            throw APIError.httpError(http.statusCode, message)
        }
    }
}

private func encodeJSON<T: Encodable>(_ value: T) throws -> Data {
    let encoder = JSONEncoder()
    return try encoder.encode(value)
}

// MARK: - Models

enum ExerciseType: String, Codable {
    case single
    case b2b
    case circuit
}

enum ExercisePrimaryMetric: String, Codable {
    case weight
    case height
    case time
    case distance
    case repsOnly = "reps_only"
}

struct Stretch: Codable, Identifiable {
    let id = UUID()
    let name: String
    let timerSeconds: Int
    let videoUrl: String
    let tips: String
}

struct SingleExercise: Codable, Identifiable {
    let id = UUID()
    let type: ExerciseType?
    let name: String
    let sets: Int
    let targetReps: Int
    let targetWeight: Double
    let warmupWeight: Double
    let hasWarmup: Bool?
    let restTime: Int
    let videoUrl: String
    let tips: String
    let isBodyweight: Bool?
    let isMachine: Bool?
    let primaryMetric: ExercisePrimaryMetric?
    let metricUnit: String?

    private enum CodingKeys: String, CodingKey {
        case type
        case name
        case sets
        case targetReps
        case targetWeight
        case warmupWeight
        case hasWarmup
        case restTime
        case videoUrl
        case tips
        case isBodyweight
        case isMachine
        case primaryMetric
        case metricUnit
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        type = try container.decodeIfPresent(ExerciseType.self, forKey: .type)
        name = try container.decode(String.self, forKey: .name)
        sets = try container.decode(Int.self, forKey: .sets)
        targetReps = try container.decode(Int.self, forKey: .targetReps)
        targetWeight = (try? container.decode(Double.self, forKey: .targetWeight))
            ?? Double((try? container.decode(Int.self, forKey: .targetWeight)) ?? 0)
        warmupWeight = (try? container.decode(Double.self, forKey: .warmupWeight))
            ?? Double((try? container.decode(Int.self, forKey: .warmupWeight)) ?? 0)
        hasWarmup = try container.decodeIfPresent(Bool.self, forKey: .hasWarmup)
        restTime = try container.decodeIfPresent(Int.self, forKey: .restTime) ?? 0
        videoUrl = try container.decodeIfPresent(String.self, forKey: .videoUrl) ?? ""
        tips = try container.decodeIfPresent(String.self, forKey: .tips) ?? ""
        isBodyweight = try container.decodeIfPresent(Bool.self, forKey: .isBodyweight)
        isMachine = try container.decodeIfPresent(Bool.self, forKey: .isMachine)
        primaryMetric = try container.decodeIfPresent(ExercisePrimaryMetric.self, forKey: .primaryMetric)
        metricUnit = try container.decodeIfPresent(String.self, forKey: .metricUnit)
    }
}

struct B2BExercise: Codable, Identifiable {
    let id = UUID()
    let type: ExerciseType
    let exercises: [SingleExercise]
    let restTime: Int
}

enum Exercise: Codable, Identifiable {
    case single(SingleExercise)
    case b2b(B2BExercise)

    var id: UUID {
        switch self {
        case .single(let ex): return ex.id
        case .b2b(let ex): return ex.id
        }
    }

    var name: String {
        switch self {
        case .single(let ex): return ex.name
        case .b2b(let ex):
            return ex.exercises.map { $0.name }.joined(separator: " + ")
        }
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(ExerciseType.self, forKey: .type)
        switch type {
        case .single, .circuit:
            let single = try SingleExercise(from: decoder)
            self = .single(single)
        case .b2b:
            let b2b = try B2BExercise(from: decoder)
            self = .b2b(b2b)
        }
    }

    func encode(to encoder: Encoder) throws {
        switch self {
        case .single(let ex): try ex.encode(to: encoder)
        case .b2b(let ex): try ex.encode(to: encoder)
        }
    }

    private enum CodingKeys: String, CodingKey {
        case type
    }
}

struct Cardio: Codable {
    let type: String
    let duration: String
    let intensity: String
    let tips: String
}

struct WorkoutPlan: Codable {
    let name: String
    let preWorkoutStretches: [Stretch]
    let postWorkoutStretches: [Stretch]
    let exercises: [Exercise]
    let cardio: Cardio?
}

struct WorkoutPlanResponse: Codable {
    let workout: WorkoutPlan
}

struct Routine: Codable, Identifiable, Hashable {
    let id: Int
    let name: String
    let description: String?
    let is_public: Int
    let user_id: String?
    let creator_username: String?
    let creator_name: String?
    let last_workout_date: String?
    let created_at: String?
    let updated_at: String?
    let like_count: Int?
    let clone_count: Int?
    let order_index: Int?
    let is_favorited: Int?

    private enum CodingKeys: String, CodingKey {
        case id
        case name
        case description
        case is_public
        case user_id
        case creator_username
        case creator_name
        case last_workout_date
        case created_at
        case updated_at
        case like_count
        case clone_count
        case order_index
        case is_favorited
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decodeLossyInt(forKey: .id)
        name = try container.decode(String.self, forKey: .name)
        description = try container.decodeIfPresent(String.self, forKey: .description)
        is_public = try container.decodeLossyInt(forKey: .is_public)
        user_id = try container.decodeIfPresent(String.self, forKey: .user_id)
        creator_username = try container.decodeIfPresent(String.self, forKey: .creator_username)
        creator_name = try container.decodeIfPresent(String.self, forKey: .creator_name)
        last_workout_date = try container.decodeIfPresent(String.self, forKey: .last_workout_date)
        created_at = try container.decodeIfPresent(String.self, forKey: .created_at)
        updated_at = try container.decodeIfPresent(String.self, forKey: .updated_at)
        like_count = container.decodeLossyIntIfPresent(forKey: .like_count)
        clone_count = container.decodeLossyIntIfPresent(forKey: .clone_count)
        order_index = container.decodeLossyIntIfPresent(forKey: .order_index)
        is_favorited = container.decodeLossyIntIfPresent(forKey: .is_favorited)
    }
}

extension KeyedDecodingContainer {
    func decodeLossyInt(forKey key: Key) throws -> Int {
        if let value = try? decode(Int.self, forKey: key) {
            return value
        }
        if let value = try? decode(String.self, forKey: key), let intValue = Int(value) {
            return intValue
        }
        if let value = try? decode(Bool.self, forKey: key) {
            return value ? 1 : 0
        }
        throw DecodingError.dataCorruptedError(forKey: key, in: self, debugDescription: "Expected Int, String, or Bool")
    }

    func decodeLossyIntIfPresent(forKey key: Key) -> Int? {
        if let value = try? decode(Int.self, forKey: key) {
            return value
        }
        if let value = try? decode(String.self, forKey: key), let intValue = Int(value) {
            return intValue
        }
        if let value = try? decode(Bool.self, forKey: key) {
            return value ? 1 : 0
        }
        return nil
    }
}

struct RoutinesResponse: Codable {
    let routines: [Routine]
}

struct UserInfoResponse: Codable {
    let id: String
    let email: String?
    let name: String?
    let username: String?
    let hasUsername: Bool
}

struct UserSettingsResponse: Codable {
    var restTimeSeconds: Int?
    var supersetRestSeconds: Int?
    var weightUnit: String?
    var heightUnit: String?
}

struct GoalsResponse: Codable {
    let goals: String?
}

struct AnalyticsResponse: Decodable {
    struct Summary: Decodable {
        let workoutsLogged: Int
        let avgDuration: Double?
        let longestStreak: Int
        let trend: [TrendPoint]
    }

    struct TrendPoint: Decodable {
        let date: String
        let count: Int

        private enum CodingKeys: String, CodingKey {
            case date
            case day
            case count
        }

        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            date = (try? container.decode(String.self, forKey: .date))
                ?? (try? container.decode(String.self, forKey: .day))
                ?? ""
            count = try container.decodeLossyInt(forKey: .count)
        }
    }

    struct WorkoutSummary: Decodable {
        let name: String
        let sessions: Int
        let lastPerformed: String?

        private enum CodingKeys: String, CodingKey {
            case name
            case sessions
            case count
            case lastPerformed
            case lastCompleted
        }

        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            name = (try? container.decode(String.self, forKey: .name)) ?? ""
            if let sessionsValue = try? container.decodeLossyInt(forKey: .sessions) {
                sessions = sessionsValue
            } else {
                sessions = (try? container.decodeLossyInt(forKey: .count)) ?? 0
            }
            lastPerformed = (try? container.decodeIfPresent(String.self, forKey: .lastPerformed))
                ?? (try? container.decodeIfPresent(String.self, forKey: .lastCompleted))
        }
    }

    let rangeDays: Int
    let summary: Summary
    let topWorkouts: [WorkoutSummary]
}

// MARK: - Workout Session Models

struct SessionSet: Codable {
    var weight: Double
    var reps: Int
}

struct SessionPartner: Codable {
    var name: String
    var isMachine: Bool?
    var primaryMetric: ExercisePrimaryMetric?
    var metricUnit: String?
    var warmup: SessionSet?
    var sets: [SessionSet]
}

struct SessionExercise: Codable, Identifiable {
    var name: String
    var type: ExerciseType
    var isMachine: Bool?
    var primaryMetric: ExercisePrimaryMetric?
    var metricUnit: String?
    var warmup: SessionSet?
    var sets: [SessionSet]
    var b2bPartner: SessionPartner?

    var id: String { name }
}

struct SessionCardio: Codable {
    var type: String
    var time: String
    var speed: Double?
    var incline: Double?
}

struct WorkoutSessionData: Codable {
    var workoutName: String
    var routineId: Int?
    var sessionId: Int?
    var startTime: String
    var exercises: [SessionExercise]
    var cardio: SessionCardio?
}

final class WorkoutSessionStore: ObservableObject {
    @Published var session: WorkoutSessionData?
    @Published var plan: WorkoutPlan?
    @Published var restRemaining: Int = 0
    @Published var isResting = false

    private let api = APIClient()
    private var restTimer: Timer?

    func clear() {
        session = nil
        plan = nil
        stopRestTimer()
    }

    func startSession(workout: WorkoutPlan, routineId: Int?) {
        plan = workout
        session = WorkoutSessionData(
            workoutName: workout.name,
            routineId: routineId,
            sessionId: nil,
            startTime: ISO8601DateFormatter().string(from: Date()),
            exercises: [],
            cardio: nil
        )
    }

    func recordSingleSet(
        exercise: SingleExercise,
        setIndex: Int,
        weight: Double,
        reps: Int,
        isWarmup: Bool,
        authToken: String?
    ) {
        guard var session else { return }
        let index = max(1, min(4, setIndex))
        var entry = session.exercises.first(where: { $0.name == exercise.name })
        if entry == nil {
            entry = SessionExercise(
                name: exercise.name,
                type: exercise.type ?? .single,
                isMachine: exercise.isMachine,
                primaryMetric: exercise.primaryMetric,
                metricUnit: exercise.metricUnit,
                warmup: nil,
                sets: [],
                b2bPartner: nil
            )
            session.exercises.append(entry!)
        }

        if isWarmup {
            entry?.warmup = SessionSet(weight: weight, reps: reps)
        } else {
            while entry!.sets.count < index {
                entry!.sets.append(SessionSet(weight: 0, reps: 0))
            }
            entry!.sets[index - 1] = SessionSet(weight: weight, reps: reps)
        }

        session.exercises = session.exercises.map { $0.name == entry!.name ? entry! : $0 }
        self.session = session

        Task {
            await autosaveSingleSet(
                exerciseName: exercise.name,
                setIndex: index,
                weight: weight,
                reps: reps,
                isWarmup: isWarmup,
                authToken: authToken
            )
        }
    }

    func recordB2BSet(
        exercise: SingleExercise,
        partner: SingleExercise,
        setIndex: Int,
        weight: Double,
        reps: Int,
        partnerWeight: Double,
        partnerReps: Int,
        authToken: String?
    ) {
        guard var session else { return }
        let index = max(1, min(4, setIndex))
        var entry = session.exercises.first(where: { $0.name == exercise.name })
        if entry == nil {
            entry = SessionExercise(
                name: exercise.name,
                type: .b2b,
                isMachine: exercise.isMachine,
                primaryMetric: exercise.primaryMetric,
                metricUnit: exercise.metricUnit,
                warmup: nil,
                sets: [],
                b2bPartner: SessionPartner(
                    name: partner.name,
                    isMachine: partner.isMachine,
                    primaryMetric: partner.primaryMetric,
                    metricUnit: partner.metricUnit,
                    warmup: nil,
                    sets: []
                )
            )
            session.exercises.append(entry!)
        }

        while entry!.sets.count < index {
            entry!.sets.append(SessionSet(weight: 0, reps: 0))
        }
        entry!.sets[index - 1] = SessionSet(weight: weight, reps: reps)

        if entry!.b2bPartner == nil {
            entry!.b2bPartner = SessionPartner(
                name: partner.name,
                isMachine: partner.isMachine,
                primaryMetric: partner.primaryMetric,
                metricUnit: partner.metricUnit,
                warmup: nil,
                sets: []
            )
        }
        while entry!.b2bPartner!.sets.count < index {
            entry!.b2bPartner!.sets.append(SessionSet(weight: 0, reps: 0))
        }
        entry!.b2bPartner!.sets[index - 1] = SessionSet(weight: partnerWeight, reps: partnerReps)

        session.exercises = session.exercises.map { $0.name == entry!.name ? entry! : $0 }
        self.session = session

        Task {
            await autosaveB2BSet(
                exerciseName: exercise.name,
                partnerName: partner.name,
                setIndex: index,
                weight: weight,
                reps: reps,
                partnerWeight: partnerWeight,
                partnerReps: partnerReps,
                authToken: authToken
            )
        }
    }

    func startRestTimer(seconds: Int) {
        stopRestTimer()
        restRemaining = max(0, seconds)
        isResting = restRemaining > 0
        guard restRemaining > 0 else { return }
        restTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
            guard let self else { return }
            if self.restRemaining <= 1 {
                self.stopRestTimer()
                return
            }
            self.restRemaining -= 1
        }
    }

    func stopRestTimer() {
        restTimer?.invalidate()
        restTimer = nil
        restRemaining = 0
        isResting = false
    }

    func finish(authToken: String?) async throws {
        guard let session else { return }
        let body = try encodeJSON(session)
        try await api.requestVoid("/api/save-workout", method: "POST", body: body, authToken: authToken)
        clear()
    }

    private func autosaveSingleSet(
        exerciseName: String,
        setIndex: Int,
        weight: Double,
        reps: Int,
        isWarmup: Bool,
        authToken: String?
    ) async {
        guard let session else { return }
        let payload = AutosavePayload(
            sessionId: session.sessionId,
            workoutName: session.workoutName,
            routineId: session.routineId,
            startTime: session.startTime,
            event: .singleSet(
                exerciseName: exerciseName,
                setIndex: setIndex,
                weight: weight,
                reps: reps,
                isWarmup: isWarmup
            )
        )

        do {
            let body = try encodeJSON(payload)
            let response: AutosaveResponse = try await api.request(
                "/api/workout-autosave",
                method: "POST",
                body: body,
                authToken: authToken
            )
            if let sessionId = response.sessionId {
                self.session?.sessionId = sessionId
            }
        } catch {
            // ignore autosave errors for now
        }
    }

    private func autosaveB2BSet(
        exerciseName: String,
        partnerName: String,
        setIndex: Int,
        weight: Double,
        reps: Int,
        partnerWeight: Double,
        partnerReps: Int,
        authToken: String?
    ) async {
        guard let session else { return }
        let payload = AutosavePayload(
            sessionId: session.sessionId,
            workoutName: session.workoutName,
            routineId: session.routineId,
            startTime: session.startTime,
            event: .b2bSet(
                exerciseName: exerciseName,
                partnerName: partnerName,
                setIndex: setIndex,
                weight: weight,
                reps: reps,
                partnerWeight: partnerWeight,
                partnerReps: partnerReps
            )
        )

        do {
            let body = try encodeJSON(payload)
            let response: AutosaveResponse = try await api.request(
                "/api/workout-autosave",
                method: "POST",
                body: body,
                authToken: authToken
            )
            if let sessionId = response.sessionId {
                self.session?.sessionId = sessionId
            }
        } catch {
            // ignore autosave errors for now
        }
    }
}

struct AutosaveResponse: Codable {
    let sessionId: Int?
}

struct AutosavePayload: Codable {
    let sessionId: Int?
    let workoutName: String
    let routineId: Int?
    let startTime: String
    let event: AutosaveEvent
}

enum AutosaveEvent: Codable {
    case singleSet(exerciseName: String, setIndex: Int, weight: Double, reps: Int, isWarmup: Bool)
    case b2bSet(exerciseName: String, partnerName: String, setIndex: Int, weight: Double, reps: Int, partnerWeight: Double, partnerReps: Int)

    private enum CodingKeys: String, CodingKey {
        case type
        case exerciseName
        case setIndex
        case weight
        case reps
        case isWarmup
        case partnerName
        case partnerWeight
        case partnerReps
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .singleSet(let exerciseName, let setIndex, let weight, let reps, let isWarmup):
            try container.encode("single_set", forKey: .type)
            try container.encode(exerciseName, forKey: .exerciseName)
            try container.encode(setIndex, forKey: .setIndex)
            try container.encode(weight, forKey: .weight)
            try container.encode(reps, forKey: .reps)
            try container.encode(isWarmup, forKey: .isWarmup)
        case .b2bSet(let exerciseName, let partnerName, let setIndex, let weight, let reps, let partnerWeight, let partnerReps):
            try container.encode("b2b_set", forKey: .type)
            try container.encode(exerciseName, forKey: .exerciseName)
            try container.encode(partnerName, forKey: .partnerName)
            try container.encode(setIndex, forKey: .setIndex)
            try container.encode(weight, forKey: .weight)
            try container.encode(reps, forKey: .reps)
            try container.encode(partnerWeight, forKey: .partnerWeight)
            try container.encode(partnerReps, forKey: .partnerReps)
        }
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(String.self, forKey: .type)
        if type == "single_set" {
            let exerciseName = try container.decode(String.self, forKey: .exerciseName)
            let setIndex = try container.decode(Int.self, forKey: .setIndex)
            let weight = try container.decode(Double.self, forKey: .weight)
            let reps = try container.decode(Int.self, forKey: .reps)
            let isWarmup = try container.decodeIfPresent(Bool.self, forKey: .isWarmup) ?? false
            self = .singleSet(exerciseName: exerciseName, setIndex: setIndex, weight: weight, reps: reps, isWarmup: isWarmup)
        } else {
            let exerciseName = try container.decode(String.self, forKey: .exerciseName)
            let partnerName = try container.decode(String.self, forKey: .partnerName)
            let setIndex = try container.decode(Int.self, forKey: .setIndex)
            let weight = try container.decode(Double.self, forKey: .weight)
            let reps = try container.decode(Int.self, forKey: .reps)
            let partnerWeight = try container.decode(Double.self, forKey: .partnerWeight)
            let partnerReps = try container.decode(Int.self, forKey: .partnerReps)
            self = .b2bSet(exerciseName: exerciseName, partnerName: partnerName, setIndex: setIndex, weight: weight, reps: reps, partnerWeight: partnerWeight, partnerReps: partnerReps)
        }
    }
}

// MARK: - Routines

@MainActor
final class RoutinesViewModel: ObservableObject {
    @Published var routines: [Routine] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let api = APIClient()

    func load(authToken: String?) async {
        isLoading = true
        errorMessage = nil
        do {
            let response: RoutinesResponse = try await api.request("/api/routines", authToken: authToken)
            routines = response.routines
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

struct RoutinesRootView: View {
    @State private var selectedRoutine: Routine?

    var body: some View {
        RoutinesView(onSelect: { routine in
            selectedRoutine = routine
        })
        .fullScreenCover(item: $selectedRoutine) { routine in
            NavigationStack {
                RoutineDetailView(routine: routine)
                    .toolbar {
                        ToolbarItem(placement: .topBarLeading) {
                            Button("Close") {
                                selectedRoutine = nil
                            }
                        }
                    }
            }
        }
    }
}

struct RoutinesView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @StateObject private var viewModel = RoutinesViewModel()
    private let horizontalPadding: CGFloat = 16
    let onSelect: (Routine) -> Void

    var body: some View {
        ZStack(alignment: .topLeading) {
            Theme.background.ignoresSafeArea()
            GeometryReader { proxy in
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("My Routines")
                                .font(.system(size: 32, weight: .bold))
                                .foregroundStyle(Theme.textPrimary)
                            Text("Build, track, and favorite workouts you want to run again.")
                                .font(.subheadline)
                                .foregroundStyle(Theme.textSecondary)
                        }

                        if viewModel.isLoading {
                            ProgressView("Loading routines...")
                                .foregroundStyle(Theme.textSecondary)
                        } else if let error = viewModel.errorMessage {
                            Text(error)
                                .foregroundStyle(.red)
                        } else {
                            LazyVStack(alignment: .leading, spacing: 12) {
                                ForEach(viewModel.routines) { routine in
                                    Button {
                                        onSelect(routine)
                                    } label: {
                                        Card {
                                            Text(routine.name)
                                                .font(.headline)
                                                .foregroundStyle(Theme.textPrimary)
                                            if let description = routine.description, !description.isEmpty {
                                                Text(description)
                                                    .font(.subheadline)
                                                    .foregroundStyle(Theme.textSecondary)
                                            }
                                        }
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .frame(minHeight: proxy.size.height, alignment: .topLeading)
                    .padding(.horizontal, horizontalPadding)
                    .padding(.top, 0)
                    .padding(.bottom, Layout.bottomBarPadding)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                .modifier(DisableScrollViewInsets())
                .ignoresSafeArea(.container, edges: .top)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .task {
            await viewModel.load(authToken: auth.bearerToken)
        }
    }
}

private struct DisableScrollViewInsets: ViewModifier {
    func body(content: Content) -> some View {
        content.background(ScrollViewInsetDisabler())
    }
}

private struct ScrollViewInsetDisabler: UIViewRepresentable {
    func makeUIView(context: Context) -> UIView {
        UIView(frame: .zero)
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        DispatchQueue.main.async {
            var view: UIView? = uiView.superview
            while view != nil, (view as? UIScrollView) == nil {
                view = view?.superview
            }
            if let scrollView = view as? UIScrollView {
                scrollView.contentInsetAdjustmentBehavior = .never
            }
        }
    }
}

struct RoutineDetailView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var sessionStore: WorkoutSessionStore
    @EnvironmentObject private var navigation: AppNavigation
    @Environment(\.dismiss) private var dismiss

    let routine: Routine

    @State private var workoutPlan: WorkoutPlan?
    @State private var isLoading = false
    @State private var errorMessage: String?

    private let api = APIClient()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(routine.name)
                        .font(.title.bold())
                        .foregroundStyle(Theme.textPrimary)
                    Text("Routine preview")
                        .font(.subheadline)
                        .foregroundStyle(Theme.textSecondary)
                }

                if let plan = workoutPlan {
                    Card {
                        ExerciseListView(plan: plan)
                    }

                    Button {
                        sessionStore.startSession(workout: plan, routineId: routine.id)
                        navigation.selectedTab = .workout
                        dismiss()
                    } label: {
                        Text("Start Workout")
                    }
                    .buttonStyle(PrimaryButtonStyle())
                } else if isLoading {
                    ProgressView("Loading workout...")
                        .foregroundStyle(Theme.textSecondary)
                } else if let errorMessage {
                    Text(errorMessage)
                        .foregroundStyle(.red)
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 12)
            .padding(.bottom, Layout.bottomBarPadding)
        }
        .background(Theme.background)
        .navigationTitle("Preview")
        .task {
            await loadWorkout()
        }
    }

    private func loadWorkout() async {
        isLoading = true
        errorMessage = nil
        do {
            let encoded = routine.name.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? routine.name
            let response: WorkoutPlanResponse = try await api.request("/api/workout/\(encoded)?routineId=\(routine.id)", authToken: auth.bearerToken)
            workoutPlan = response.workout
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

struct ExerciseListView: View {
    let plan: WorkoutPlan

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Exercises")
                .font(.headline)
                .foregroundStyle(Theme.textPrimary)
            ForEach(plan.exercises) { exercise in
                VStack(alignment: .leading, spacing: 6) {
                    Text(exercise.name)
                        .font(.subheadline.bold())
                        .foregroundStyle(Theme.textPrimary)
                    switch exercise {
                    case .single(let ex):
                        Text("Sets: \(ex.sets) • Target: \(ex.targetReps) reps")
                            .font(.footnote)
                            .foregroundStyle(Theme.textSecondary)
                    case .b2b:
                        Text("Superset")
                            .font(.footnote)
                            .foregroundStyle(Theme.textSecondary)
                    }
                }
            }
        }
    }
}

// MARK: - Active Workout

struct ActiveWorkoutEntryView: View {
    @EnvironmentObject private var sessionStore: WorkoutSessionStore
    @EnvironmentObject private var navigation: AppNavigation

    var body: some View {
        if let session = sessionStore.session {
            ActiveWorkoutView(session: session)
        } else {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Workout")
                            .font(.title.bold())
                            .foregroundStyle(Theme.textPrimary)
                        Text("Start a workout from your routines.")
                            .font(.subheadline)
                            .foregroundStyle(Theme.textSecondary)
                    }

                    Card {
                        Text("No active workout")
                            .font(.headline)
                            .foregroundStyle(Theme.textPrimary)
                        Text("Choose a routine to begin logging sets.")
                            .font(.subheadline)
                            .foregroundStyle(Theme.textSecondary)
                        Button {
                            navigation.selectedTab = .routines
                        } label: {
                            Text("Go to Routines")
                        }
                        .buttonStyle(SecondaryButtonStyle())
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, Layout.bottomBarPadding)
            }
            .background(Theme.background)
        }
    }
}

struct ActiveWorkoutView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var sessionStore: WorkoutSessionStore

    let session: WorkoutSessionData

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text(session.workoutName)
                    .font(.title.bold())
                    .foregroundStyle(Theme.textPrimary)

                if sessionStore.isResting {
                    Text("Rest: \(sessionStore.restRemaining)s")
                        .font(.headline)
                        .foregroundStyle(.orange)
                }

                if let recorded = sessionStore.session?.exercises, !recorded.isEmpty {
                    Text("Logged Sets")
                        .font(.headline)
                        .foregroundStyle(Theme.textPrimary)
                    ForEach(recorded) { exercise in
                        RecordedExerciseCard(exercise: exercise)
                    }
                }

                Text("Log Sets")
                    .font(.headline)
                    .foregroundStyle(Theme.textPrimary)

                ForEach(sessionStore.plan?.exercises ?? [], id: \.id) { exercise in
                    switch exercise {
                    case .single(let ex):
                        SingleExerciseCard(exercise: ex)
                    case .b2b(let ex):
                        B2BExerciseCard(exercise: ex)
                    }
                }

                Button {
                    Task {
                        try? await sessionStore.finish(authToken: auth.bearerToken)
                    }
                } label: {
                    Text("Finish Workout")
                }
                .buttonStyle(PrimaryButtonStyle())
            }
            .padding(.horizontal, 16)
            .padding(.top, 12)
            .padding(.bottom, Layout.bottomBarPadding)
        }
        .background(Theme.background)
        .navigationTitle("Active Workout")
    }
}

struct RecordedExerciseCard: View {
    let exercise: SessionExercise

    var body: some View {
        Card {
            Text(exercise.name)
                .font(.subheadline.bold())
                .foregroundStyle(Theme.textPrimary)
            if let warmup = exercise.warmup {
                Text("Warmup: \(warmup.weight) x \(warmup.reps)")
                    .font(.footnote)
                    .foregroundStyle(Theme.textSecondary)
            }
            ForEach(Array(exercise.sets.enumerated()), id: \.offset) { index, set in
                Text("Set \(index + 1): \(set.weight) x \(set.reps)")
                    .font(.footnote)
                    .foregroundStyle(Theme.textSecondary)
            }
            if let partner = exercise.b2bPartner {
                Text("Partner: \(partner.name)")
                    .font(.footnote)
                    .foregroundStyle(Theme.textSecondary)
            }
        }
    }
}

struct SingleExerciseCard: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var sessionStore: WorkoutSessionStore

    let exercise: SingleExercise

    @State private var setIndex = 1
    @State private var weightText = ""
    @State private var repsText = ""
    @State private var isWarmup = false

    var body: some View {
        Card {
            Text(exercise.name)
                .font(.subheadline.bold())
                .foregroundStyle(Theme.textPrimary)

            Picker("Set", selection: $setIndex) {
                ForEach(1...4, id: \.self) { index in
                    Text("Set \(index)").tag(index)
                }
            }
            .pickerStyle(.segmented)

            Toggle("Warmup", isOn: $isWarmup)

            HStack {
                TextField("Weight", text: $weightText)
                    .keyboardType(.decimalPad)
                TextField("Reps", text: $repsText)
                    .keyboardType(.numberPad)
            }
            .textFieldStyle(.roundedBorder)

            Button("Save Set") {
                let weight = Double(weightText) ?? 0
                let reps = Int(repsText) ?? 0
                sessionStore.recordSingleSet(
                    exercise: exercise,
                    setIndex: setIndex,
                    weight: weight,
                    reps: reps,
                    isWarmup: isWarmup,
                    authToken: auth.bearerToken
                )
                sessionStore.startRestTimer(seconds: exercise.restTime)
            }
            .buttonStyle(SecondaryButtonStyle())
        }
    }
}

struct B2BExerciseCard: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var sessionStore: WorkoutSessionStore

    let exercise: B2BExercise

    @State private var setIndex = 1
    @State private var weightText1 = ""
    @State private var repsText1 = ""
    @State private var weightText2 = ""
    @State private var repsText2 = ""

    var body: some View {
        Card {
            Text(exercise.exercises.map { $0.name }.joined(separator: " + "))
                .font(.subheadline.bold())
                .foregroundStyle(Theme.textPrimary)

            Picker("Set", selection: $setIndex) {
                ForEach(1...4, id: \.self) { index in
                    Text("Set \(index)").tag(index)
                }
            }
            .pickerStyle(.segmented)

            HStack {
                TextField("\(exercise.exercises[0].name) weight", text: $weightText1)
                    .keyboardType(.decimalPad)
                TextField("Reps", text: $repsText1)
                    .keyboardType(.numberPad)
            }
            .textFieldStyle(.roundedBorder)

            HStack {
                TextField("\(exercise.exercises[1].name) weight", text: $weightText2)
                    .keyboardType(.decimalPad)
                TextField("Reps", text: $repsText2)
                    .keyboardType(.numberPad)
            }
            .textFieldStyle(.roundedBorder)

            Button("Save Pair") {
                let weight1 = Double(weightText1) ?? 0
                let reps1 = Int(repsText1) ?? 0
                let weight2 = Double(weightText2) ?? 0
                let reps2 = Int(repsText2) ?? 0
                sessionStore.recordB2BSet(
                    exercise: exercise.exercises[0],
                    partner: exercise.exercises[1],
                    setIndex: setIndex,
                    weight: weight1,
                    reps: reps1,
                    partnerWeight: weight2,
                    partnerReps: reps2,
                    authToken: auth.bearerToken
                )
                sessionStore.startRestTimer(seconds: exercise.restTime)
            }
            .buttonStyle(SecondaryButtonStyle())
        }
    }
}

// MARK: - Profile

@MainActor
final class ProfileViewModel: ObservableObject {
    @Published var userInfo: UserInfoResponse?
    @Published var settings = UserSettingsResponse(restTimeSeconds: 60, supersetRestSeconds: 15, weightUnit: "lbs", heightUnit: "in")
    @Published var goalsText: String = ""
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let api = APIClient()

    private struct SettingsPayload: Codable {
        let restTimeSeconds: Int
        let supersetRestSeconds: Int
        let weightUnit: String
        let heightUnit: String
    }

    func load(authToken: String?) async {
        isLoading = true
        errorMessage = nil
        do {
            let user: UserInfoResponse = try await api.request("/api/user", authToken: authToken)
            userInfo = user
            let settingsResponse: UserSettingsResponse = try await api.request("/api/user/settings", authToken: authToken)
            settings = settingsResponse
            let goals: GoalsResponse = try await api.request("/api/goals", authToken: authToken)
            goalsText = goals.goals ?? ""
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func saveSettings(authToken: String?) async {
        do {
            let payload = SettingsPayload(
                restTimeSeconds: settings.restTimeSeconds ?? 60,
                supersetRestSeconds: settings.supersetRestSeconds ?? 15,
                weightUnit: settings.weightUnit ?? "lbs",
                heightUnit: settings.heightUnit ?? "in"
            )
            let body = try encodeJSON(payload)
            try await api.requestVoid("/api/user/settings", method: "POST", body: body, authToken: authToken)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func saveGoals(authToken: String?) async {
        do {
            let body = try encodeJSON(["goals": goalsText])
            try await api.requestVoid("/api/goals", method: "POST", body: body, authToken: authToken)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

struct ProfileView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var sessionStore: WorkoutSessionStore
    @StateObject private var viewModel = ProfileViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack(alignment: .center, spacing: 12) {
                    if let user = viewModel.userInfo {
                        Text(user.username ?? user.name ?? user.email ?? "Profile")
                            .font(.title.bold())
                            .foregroundStyle(Theme.textPrimary)
                    }

                    Spacer()

                    Button("Sign Out") {
                        auth.signOut()
                        sessionStore.clear()
                    }
                    .buttonStyle(SecondaryButtonStyle())
                }

                if viewModel.isLoading {
                    ProgressView("Loading profile...")
                        .foregroundStyle(Theme.textSecondary)
                }

                if let error = viewModel.errorMessage {
                    Text(error)
                        .foregroundStyle(.red)
                }

                Card {
                    Text("Settings")
                        .font(.headline)
                        .foregroundStyle(Theme.textPrimary)
                    VStack(alignment: .leading, spacing: 12) {
                        TextField("Rest (sec)", value: Binding(
                            get: { viewModel.settings.restTimeSeconds ?? 60 },
                            set: { viewModel.settings.restTimeSeconds = $0 }
                        ), formatter: NumberFormatter())
                        .textFieldStyle(.roundedBorder)

                        TextField("Superset Rest (sec)", value: Binding(
                            get: { viewModel.settings.supersetRestSeconds ?? 15 },
                            set: { viewModel.settings.supersetRestSeconds = $0 }
                        ), formatter: NumberFormatter())
                        .textFieldStyle(.roundedBorder)

                        TextField("Weight Unit", text: Binding(
                            get: { viewModel.settings.weightUnit ?? "lbs" },
                            set: { viewModel.settings.weightUnit = $0 }
                        ))
                        .textFieldStyle(.roundedBorder)

                        TextField("Height Unit", text: Binding(
                            get: { viewModel.settings.heightUnit ?? "in" },
                            set: { viewModel.settings.heightUnit = $0 }
                        ))
                        .textFieldStyle(.roundedBorder)

                        Button("Save Settings") {
                            Task { await viewModel.saveSettings(authToken: auth.bearerToken) }
                        }
                        .buttonStyle(PrimaryButtonStyle())
                    }
                }

                Card {
                    Text("Goals")
                        .font(.headline)
                        .foregroundStyle(Theme.textPrimary)
                    TextEditor(text: $viewModel.goalsText)
                        .frame(minHeight: 120)
                        .scrollContentBackground(.hidden)
                        .background(Theme.surfaceElevated)
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                    Button("Save Goals") {
                        Task { await viewModel.saveGoals(authToken: auth.bearerToken) }
                    }
                    .buttonStyle(PrimaryButtonStyle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 12)
            .padding(.bottom, Layout.bottomBarPadding)
        }
        .background(Theme.background)
        .navigationTitle("Profile")
        .task {
            await viewModel.load(authToken: auth.bearerToken)
        }
    }
}

// MARK: - Analytics

@MainActor
final class AnalyticsViewModel: ObservableObject {
    @Published var analytics: AnalyticsResponse?
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let api = APIClient()

    func load(authToken: String?) async {
        isLoading = true
        errorMessage = nil
        do {
            let response: AnalyticsResponse = try await api.request("/api/profile/analytics?range=30d", authToken: authToken)
            analytics = response
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

struct AnalyticsView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @StateObject private var viewModel = AnalyticsViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Analytics")
                    .font(.title.bold())
                    .foregroundStyle(Theme.textPrimary)

                if viewModel.isLoading {
                    ProgressView("Loading analytics...")
                        .foregroundStyle(Theme.textSecondary)
                }

                if let error = viewModel.errorMessage {
                    Text(error)
                        .foregroundStyle(.red)
                }

                if let analytics = viewModel.analytics {
                    Card {
                        Text("Summary")
                            .font(.headline)
                            .foregroundStyle(Theme.textPrimary)
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Workouts logged: \(analytics.summary.workoutsLogged)")
                                .foregroundStyle(Theme.textSecondary)
                            if let avg = analytics.summary.avgDuration {
                                Text("Avg duration: \(Int(avg)) min")
                                    .foregroundStyle(Theme.textSecondary)
                            }
                            Text("Longest streak: \(analytics.summary.longestStreak)")
                                .foregroundStyle(Theme.textSecondary)
                        }
                    }

                    Card {
                        Text("Top Workouts")
                            .font(.headline)
                            .foregroundStyle(Theme.textPrimary)
                        VStack(alignment: .leading, spacing: 8) {
                            ForEach(analytics.topWorkouts, id: \.name) { workout in
                                Text("\(workout.name) • \(workout.sessions) sessions")
                                    .foregroundStyle(Theme.textSecondary)
                            }
                            if analytics.topWorkouts.isEmpty {
                                Text("No workouts yet")
                                    .foregroundStyle(Theme.textSecondary)
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 12)
            .padding(.bottom, Layout.bottomBarPadding)
        }
        .background(Theme.background)
        .navigationTitle("Analytics")
        .task {
            await viewModel.load(authToken: auth.bearerToken)
        }
    }
}

#Preview {
    ContentView()
}

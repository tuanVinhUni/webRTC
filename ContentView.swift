import SwiftUI

struct ContentView: View {
    @State private var isRecording = false
    private var screenSharingViewController = ScreenSharingViewController()

    var body: some View {
        VStack {
            Button(action: {
                isRecording = true
                screenSharingViewController.isRecording = true
            }) {
                Text("Start Screen Sharing")
            }
            .padding()
            .background(Color.green)
            .foregroundColor(.white)
            .cornerRadius(8)
            
            Button(action: {
                isRecording = false
                screenSharingViewController.isRecording = false
            }) {
                Text("Stop Screen Sharing")
            }
            .padding()
            .background(Color.red)
            .foregroundColor(.white)
            .cornerRadius(8)
            
            Button(action: screenSharingViewController.setupWebSocket){
            Text("anc")
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}

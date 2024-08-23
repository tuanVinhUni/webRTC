import UIKit
import ReplayKit
import WebRTC

class ScreenSharingViewController: UIViewController, RPBroadcastControllerDelegate {
    
    var broadcastController: RPBroadcastController?
    var peerConnection: RTCPeerConnection?
    var localStream: RTCMediaStream?
    var webSocketTask: URLSessionWebSocketTask?
    var isRecording: Bool = false {
        didSet {
            if isRecording {
                startScreenSharing()
            } else {
                stopScreenSharing()
            }
        }
    }
    // Custom initializer for programmatic instantiation
    init() {
        super.init(nibName: nil, bundle: nil)
        setupWebRTC()
        setupWebSocket()
    }

    // Cần thêm hàm khởi tạo bắt buộc này khi sử dụng init()
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupWebRTC()
        setupWebSocket()
    }
    
    func startScreenSharing() {
        RPBroadcastActivityViewController.load { (broadcastActivityViewController, error) in
            guard let broadcastActivityViewController = broadcastActivityViewController, error == nil else {
                print("Error loading broadcast activity view controller: \(error!)")
                return
            }
            broadcastActivityViewController.delegate = self
            broadcastActivityViewController.modalPresentationStyle = .popover
            self.present(broadcastActivityViewController, animated: true, completion: nil)
        }
    }

    func stopScreenSharing() {
        broadcastController?.finishBroadcast { error in
            if let error = error {
                print("Error stopping broadcast: \(error)")
            } else {
                print("Broadcast stopped successfully.")
            }
        }
    }

    func setupWebRTC() {
        let configuration = RTCConfiguration()
        let peerConnectionFactory = RTCPeerConnectionFactory()
        peerConnection = peerConnectionFactory.peerConnection(with: configuration, constraints: RTCMediaConstraints(mandatoryConstraints: nil, optionalConstraints: nil), delegate: nil)

        localStream = peerConnectionFactory.mediaStream(withStreamId: "localStream")
        let videoSource = peerConnectionFactory.videoSource()
        let videoTrack = peerConnectionFactory.videoTrack(with: videoSource, trackId: "video0")
        localStream?.addVideoTrack(videoTrack)
        peerConnection?.add(localStream!)

        // Create offer and send it to the server
        peerConnection?.offer(for: RTCMediaConstraints(mandatoryConstraints: nil, optionalConstraints: nil), completionHandler: { (sdp, error) in
            guard let sdp = sdp, error == nil else {
                print("Error creating offer: \(error!)")
                return
            }
            self.peerConnection?.setLocalDescription(sdp, completionHandler: { (error) in
                guard error == nil else {
                    print("Error setting local description: \(error!)")
                    return
                }
                self.sendWebSocketMessage(["type": "offer", "sdp": sdp.sdp])
            })
        })
    }

    func setupWebSocket() {
        let url = URL(string: "ws://192.168.1.28:8888/ws")!
        let urlSession = URLSession(configuration: .default)
        webSocketTask = urlSession.webSocketTask(with: url)
        webSocketTask?.resume()
    }

    func sendWebSocketMessage(_ message: [String: Any]) {
        guard let webSocketTask = webSocketTask else { return }
        let jsonData = try! JSONSerialization.data(withJSONObject: message, options: [])
        let message = URLSessionWebSocketTask.Message.data(jsonData)
        webSocketTask.send(message) { error in
            if let error = error {
                print("WebSocket sending error: \(error)")
            }
        }
    }

    // RPBroadcastControllerDelegate methods
    func broadcastController(_ broadcastController: RPBroadcastController, didFinishWithError error: Error?) {
        if let error = error {
            print("Broadcast finished with error: \(error)")
        } else {
            print("Broadcast finished successfully.")
        }
    }

    func broadcastController(_ broadcastController: RPBroadcastController, didUpdateServiceInfo serviceInfo: [String : NSCoding & NSObjectProtocol]) {
        print("Broadcast service info updated: \(serviceInfo)")
    }
}

// RPBroadcastActivityViewControllerDelegate methods
extension ScreenSharingViewController: RPBroadcastActivityViewControllerDelegate {
    func broadcastActivityViewController(_ broadcastActivityViewController: RPBroadcastActivityViewController, didFinishWith broadcastController: RPBroadcastController?, error: Error?) {
        broadcastActivityViewController.dismiss(animated: true) {
            guard let broadcastController = broadcastController, error == nil else {
                print("Error starting broadcast: \(error!)")
                return
            }
            self.broadcastController = broadcastController
            broadcastController.delegate = self
            broadcastController.startBroadcast { error in
                if let error = error {
                    print("Error starting broadcast: \(error)")
                } else {
                    print("Broadcast started successfully.")
                }
            }
        }
    }
}

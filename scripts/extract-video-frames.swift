import AppKit
import AVFoundation
import Foundation

guard CommandLine.arguments.count == 8 else {
  FileHandle.standardError.write(
    Data("Usage: extract-video-frames.swift <video> <output-dir> <frame-count> <max-width> <max-height> <jpeg|png> <quality>\n".utf8)
  )
  exit(1)
}

let sourceURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)

guard
  let frameCount = Int(CommandLine.arguments[3]), frameCount > 1,
  let maxWidth = Int(CommandLine.arguments[4]), maxWidth > 0,
  let maxHeight = Int(CommandLine.arguments[5]), maxHeight > 0,
  ["jpeg", "png"].contains(CommandLine.arguments[6]),
  let imageQuality = Double(CommandLine.arguments[7]), imageQuality > 0, imageQuality <= 1
else {
  FileHandle.standardError.write(Data("Invalid extraction options.\n".utf8))
  exit(1)
}

try FileManager.default.createDirectory(at: outputURL, withIntermediateDirectories: true)

let asset = AVURLAsset(url: sourceURL)
let duration = CMTimeGetSeconds(asset.duration)

guard duration.isFinite, duration > 0 else {
  FileHandle.standardError.write(Data("Could not read video duration.\n".utf8))
  exit(1)
}

let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: maxWidth, height: maxHeight)
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

let outputFormat = CommandLine.arguments[6]
let bitmapType: NSBitmapImageRep.FileType = outputFormat == "png" ? .png : .jpeg
let outputExtension = outputFormat == "png" ? "png" : "jpg"

for index in 0..<frameCount {
  autoreleasepool {
    do {
      let seconds = duration * Double(index) / Double(frameCount)
      let time = CMTime(seconds: seconds, preferredTimescale: 600)
      let image = try generator.copyCGImage(at: time, actualTime: nil)
      let bitmap = NSBitmapImageRep(cgImage: image)

      guard let data = bitmap.representation(
        using: bitmapType,
        properties: outputFormat == "png" ? [:] : [.compressionFactor: imageQuality]
      ) else {
        throw NSError(domain: "FrameExtraction", code: 1)
      }

      let filename = String(format: "frame-%03d.\(outputExtension)", index)
      try data.write(to: outputURL.appendingPathComponent(filename), options: .atomic)
    } catch {
      FileHandle.standardError.write(Data("Failed at frame \(index): \(error)\n".utf8))
      exit(1)
    }
  }
}

print("Extracted \(frameCount) frames from \(sourceURL.lastPathComponent) (\(String(format: "%.3f", duration))s).")

import Foundation

@objc(ICloudKVS)
class ICloudKVS: NSObject {
  
  private let store = NSUbiquitousKeyValueStore.default
  
  override init() {
    super.init()
    store.synchronize()
  }
  
  @objc func setString(_ value: String, forKey key: String,
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    store.set(value, forKey: key)
    store.synchronize()
    resolve(nil)
  }
  
  @objc func getString(_ key: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let value = store.string(forKey: key)
    resolve(value)
  }
  
  @objc func removeValue(_ key: String,
                         resolver resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
    store.removeObject(forKey: key)
    store.synchronize()
    resolve(nil)
  }
  
  @objc func synchronize(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    let success = store.synchronize()
    resolve(success)
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

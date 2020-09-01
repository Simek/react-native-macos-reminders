#import <Cocoa/Cocoa.h>
#import <React/RCTBridgeDelegate.h>

@class RCTBridge;

@interface AppDelegate : NSObject <NSApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, readonly) RCTBridge *bridge;

@end

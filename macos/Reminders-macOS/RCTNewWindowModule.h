#import <React/RCTBridgeModule.h>

@interface RCTNewWindowModule : NSObject <RCTBridgeModule>

@property (nonatomic, weak) RCTBridge *bridge;

@end

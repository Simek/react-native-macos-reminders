#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>

#if DEBUG
#import <React/RCTDevLoadingView.h>
#endif

@implementation AppDelegate

- (void)awakeFromNib {
  [super awakeFromNib];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
  #if DEBUG
    [bridge moduleForClass:[RCTDevLoadingView class]];
  #endif
  _bridge = bridge;
}

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
  // Insert code here to initialize your application
}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
  // Insert code here to tear down your application
}

#pragma mark - RCTBridgeDelegate Methods

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

#import <Cocoa/Cocoa.h>
#import <React-RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
#import <React-RCTAppDelegate/RCTReactNativeFactory.h>

@interface AppDelegate : RCTDefaultReactNativeFactoryDelegate <NSApplicationDelegate>

@property (nonatomic, strong) RCTReactNativeFactory *reactNativeFactory;

@end

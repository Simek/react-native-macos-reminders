#import "RCTNewWindowModule.h"
#import <React/RCTBridge.h>
#import <React/RCTRootView.h>
#import <Cocoa/Cocoa.h>

@implementation RCTNewWindowModule

RCT_EXPORT_MODULE(NewWindowModule);

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(openWindow:(NSString *)moduleName
                  initialProps:(NSDictionary *)initialProps)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSRect frame = NSMakeRect(0, 0, 480, 520);
    NSWindow *window = [[NSWindow alloc]
      initWithContentRect:frame
      styleMask:NSWindowStyleMaskTitled | NSWindowStyleMaskResizable | NSWindowStyleMaskClosable | NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskFullSizeContentView
      backing:NSBackingStoreBuffered
      defer:NO];

    window.titleVisibility = NSWindowTitleHidden;
    window.titlebarAppearsTransparent = YES;
    window.movableByWindowBackground = YES;
    window.minSize = NSMakeSize(350, 520);

    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.bridge moduleName:moduleName initialProperties:initialProps];
    window.contentView = rootView;

    [window makeKeyAndOrderFront:nil];

    static NSMutableArray *windows;
    static dispatch_once_t once;
    dispatch_once(&once, ^{
      windows = [NSMutableArray new];
    });
    [windows addObject:window];
  });
}

@end

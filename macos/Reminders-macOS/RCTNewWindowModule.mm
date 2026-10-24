#import "RCTNewWindowModule.h"
#import "AppDelegate.h"
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

    AppDelegate *appDelegate = (AppDelegate *)[NSApp delegate];
    NSView *rootView = [appDelegate.reactNativeFactory.rootViewFactory viewWithModuleName:moduleName
                                                                         initialProperties:initialProps]; 
    ((RCTUIView *)rootView).backgroundColor = [NSColor clearColor];
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

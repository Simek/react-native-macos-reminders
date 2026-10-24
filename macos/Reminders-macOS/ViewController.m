#import "ViewController.h"
#import "AppDelegate.h"
#import <QuartzCore/QuartzCore.h>
#import <React/RCTUIKit.h>

@implementation ViewController

- (void)viewDidLoad {
  [super viewDidLoad];

  AppDelegate *appDelegate = (AppDelegate *)[NSApp delegate];
  RCTRootViewFactory *rootViewFactory = appDelegate.reactNativeFactory.rootViewFactory;
  NSView *rootView = [rootViewFactory viewWithModuleName:@"Reminders" initialProperties:nil];

  NSView *view = [self view];

  [view addSubview:rootView];
  ((RCTUIView *)rootView).backgroundColor = [NSColor clearColor];
  rootView.wantsLayer = YES;
  rootView.layer.backgroundColor = [NSColor clearColor].CGColor;
  [rootView setFrame:[view bounds]];
  [rootView setAutoresizingMask:(NSViewMinXMargin | NSViewMinXMargin | NSViewMinYMargin | NSViewMaxYMargin | NSViewWidthSizable | NSViewHeightSizable)];
}

- (BOOL)allowsVibrancy {
  return YES;
}

@end

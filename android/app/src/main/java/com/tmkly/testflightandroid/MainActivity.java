package com.tmkly.testflightandroid;

import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import expo.modules.ReactActivityDelegateWrapper;

public class MainActivity extends ReactActivity {

  private static final String PACKAGE_INSTALLED_ACTION =
          "com.tmkly.testflight.apis.content.SESSION_API_PACKAGE_INSTALLED";
  private static final String TAG = "MainActivity";

  private static MainActivity instance;

  public static MainActivity getInstance() {
    return instance;
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support 
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
    instance = this;
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    Bundle extras = intent.getExtras();
    Log.d(TAG, "received new intent " + intent.getAction());
    if (PACKAGE_INSTALLED_ACTION.equals(intent.getAction())) {
      int status = extras.getInt(PackageInstaller.EXTRA_STATUS);
      //String message = extras.getString(PackageInstaller.EXTRA_STATUS_MESSAGE);
      switch (status) {
        case PackageInstaller.STATUS_PENDING_USER_ACTION:
          // This test app isn't privileged, so the user has to confirm the install.
          Log.d(TAG, "Install pending user action " + status);
          /*
          FATAL EXCEPTION: main
          Process: com.tmkly.testflightandroid, PID: 10135
          java.lang.NullPointerException: Attempt to invoke virtual method 'boolean android.content.Intent.migrateExtraStreamToClipData(android.content.Context)' on a null object reference
              at android.app.Instrumentation.execStartActivity(Instrumentation.java:1741)
              at android.app.Activity.startActivityForResult(Activity.java:5404)
              at androidx.activity.ComponentActivity.startActivityForResult(ComponentActivity.java:647)
              at android.app.Activity.startActivityForResult(Activity.java:5362)
              at androidx.activity.ComponentActivity.startActivityForResult(ComponentActivity.java:628)
              at android.app.Activity.startActivity(Activity.java:5748)
              at android.app.Activity.startActivity(Activity.java:5701)
              at com.tmkly.testflightandroid.MainActivity.onNewIntent(MainActivity.java:44)
              at android.app.Activity.performNewIntent(Activity.java:8067)
              at android.app.Instrumentation.callActivityOnNewIntent(Instrumentation.java:1429)
              at android.app.Instrumentation.callActivityOnNewIntent(Instrumentation.java:1442)
              at android.app.ActivityThread.deliverNewIntents(ActivityThread.java:3832)
              at android.app.ActivityThread.handleNewIntent(ActivityThread.java:3839)
              at android.app.servertransaction.NewIntentItem.execute(NewIntentItem.java:56)
              at android.app.servertransaction.ActivityTransactionItem.execute(ActivityTransactionItem.java:45)
              at android.app.servertransaction.TransactionExecutor.executeCallbacks(TransactionExecutor.java:135)c
              at android.app.servertransaction.TransactionExecutor.execute(TransactionExecutor.java:95)
              at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2210)
              at android.os.Handler.dispatchMessage(Handler.java:106)
              at android.os.Looper.loopOnce(Looper.java:201)
              at android.os.Looper.loop(Looper.java:288)
              at android.app.ActivityThread.main(ActivityThread.java:7839)
              at java.lang.reflect.Method.invoke(Native Method)
              at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:548)
              at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1003)'
           */
          //Intent confirmIntent = (Intent) extras.get(Intent.EXTRA_INTENT);
          Intent confirmationIntent = intent.getParcelableExtra(Intent.EXTRA_INTENT);
          startActivity(confirmationIntent);
          break;
        case PackageInstaller.STATUS_SUCCESS:
          Log.d(TAG, "Install succeeded " + status);
          Toast.makeText(this, "Install succeeded!", Toast.LENGTH_SHORT).show();
          break;
        case PackageInstaller.STATUS_FAILURE:
        case PackageInstaller.STATUS_FAILURE_ABORTED:
        case PackageInstaller.STATUS_FAILURE_BLOCKED:
        case PackageInstaller.STATUS_FAILURE_CONFLICT:
        case PackageInstaller.STATUS_FAILURE_INCOMPATIBLE:
        case PackageInstaller.STATUS_FAILURE_INVALID:
        case PackageInstaller.STATUS_FAILURE_STORAGE:
          Log.d(TAG, "Install Failed " + status);
          Toast.makeText(this, "Install failed! " + status,
                  Toast.LENGTH_SHORT).show();
          break;
        default:
          Log.d(TAG, "Unrecognised status " + status);
          Toast.makeText(this, "Unrecognized status received from installer: " + status,
                  Toast.LENGTH_SHORT).show();
      }
    }
  }

  @Override
  public void startActivity(Intent intent, Bundle options) {
    if (intent == null) {
      intent = new Intent();
    }
    super.startActivity(intent, options);
  }

  @Override
  public void startActivityForResult(Intent intent, int requestCode) {
    if (intent == null) {
      intent = new Intent();
    }
    super.startActivityForResult(intent, requestCode);
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "main";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        ));
  }

  /**
   * Align the back button behavior with Android S
   * where moving root activities to background instead of finishing activities.
   * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
   */
  @Override
  public void invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        // For non-root activities, use the default implementation to finish them.
        super.invokeDefaultOnBackPressed();
      }
      return;
    }

    // Use the default back button implementation on Android S
    // because it's doing more than {@link Activity#moveTaskToBack} in fact.
    super.invokeDefaultOnBackPressed();
  }
}

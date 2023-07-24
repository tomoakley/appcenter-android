package com.tmkly.testflightandroid;

import android.app.PendingIntent;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageInstaller;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class ApkInstallerModule extends ReactContextBaseJavaModule {
    private static final String PACKAGE_INSTALLED_ACTION =
            "com.tmkly.testflight.apis.content.SESSION_API_PACKAGE_INSTALLED";
    private final ReactApplicationContext reactContext;

    public ApkInstallerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ApkInstaller";
    }

    private File getFile(String filePath, String apkName) {
        File file = new File(filePath);
        if (!file.exists()) {
            String yourFilePath = reactContext.getFilesDir() + "/" + apkName;
            Log.d("ApkInstallerModule", filePath + ", " + yourFilePath);
            return new File(yourFilePath);
        }
        return file;
    }

    private void addApkToInstallSession(String filePath, String apkName, PackageInstaller.Session session)
            throws IOException {
        ContentResolver resolver = reactContext.getContentResolver();
        File file = getFile(filePath, apkName);
        Uri uri = Uri.fromFile(file);
        // It's recommended to pass the file size to openWrite(). Otherwise installation may fail
        // if the disk is almost full.
        try (OutputStream packageInSession = session.openWrite("package", 0, -1);
            InputStream is = reactContext.getContentResolver().openInputStream(uri)) {
             //InputStream is = MainActivity.getInstance().getAssets().open(assetName)) {
            byte[] buffer = new byte[16384];
            int n;
            while ((n = is.read(buffer)) >= 0) {
                packageInSession.write(buffer, 0, n);
            }
            session.fsync(packageInSession);
        }
    }


    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    public void install(String filePath, String packageName, String apkName, Promise promise) throws IOException {

        PackageInstaller packageInstaller = reactContext.getPackageManager()
                .getPackageInstaller();
        PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(
                PackageInstaller.SessionParams.MODE_FULL_INSTALL);
        params.setAppPackageName(packageName);
        PackageInstaller.Session session = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Log.d("ApkInstallerModule", "can install packages: " + getReactApplicationContext().getPackageManager().canRequestPackageInstalls());
        }
        try {
            int sessionId = packageInstaller.createSession(params);
            session = packageInstaller.openSession(sessionId);
            addApkToInstallSession(filePath, apkName, session);
            Intent intent = new Intent(reactContext, MainActivity.class);
            intent.setAction(PACKAGE_INSTALLED_ACTION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra(PackageInstaller.EXTRA_STATUS, -1);
            PendingIntent pendingIntent = PendingIntent.getActivity(reactContext, 3439, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            IntentSender statusReceiver = pendingIntent.getIntentSender();
            session.commit(statusReceiver);
            session.close();

            promise.resolve(null);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}

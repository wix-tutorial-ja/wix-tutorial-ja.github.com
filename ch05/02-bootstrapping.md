---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 5 Net と .NET / 2. ブートストラップ
current: ch05-02
prev: 01-framed-by-net
prev-title: 1. .NET の枠組み
next: 03-launch-the-internet
next-title: 3. インターネットを起動する
origin: /net-and-net/bootstrapping/
---
#  Lesson 5 Net と .NET

## 2. ブートストラップ

(未翻訳)

We've already seen how to detect external packages like the .NET Framework but users expect more than a mere warning when prerequisites and dependencies are not yet present on their machine. Creating complex installers that not only warn about these situations but install the required dependent packages themselves were not at all easy to author. But now, thanks to Burn built into WiX, it's a breeze.

A Burn project, called a bundle, is just as easy to author. Note that this is a separate WiX project: you author your own MSIs exactly as before. The bundle will assemble the already finished MSIs and other packages we want to install together, and will create a separate bootstrapper installer that consists of an executable the user can start, plus all the separate MSIs and EXEs needed for the various packages (either external or bundled inside the main executable).

    <Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
      <Bundle Name="..." Version="..." Manufacturer="..." UpgradeCode="..." Copyright="..." IconSourceFile="..." AboutUrl="...">
        <BootstrapperApplicationRef Id="WixStandardBootstrapperApplication.RtfLicense" />
        
        <Chain>
          <ExePackage Id="Dependency1" SourceFile="Dependency_package_1.exe" />
          <ExePackage Id="Dependency2" SourceFile="Dependency_package_2.exe" />
        
          <RollbackBoundary />
        
          <MsiPackage Id="MainPackage" SourceFile="Main_package.msi" Vital="yes" />
        </Chain>
      </Bundle>
    </Wix>
Building this project is just as easy as any other project we've seen so far, only that it creates an .exe, not an .msi (SampleBurn.exe, to be exact):

candle.exe SampleBurn.wxs
light.exe -ext WixBalExtension SampleBurn.wixobj
Unlike a regular project, this has a Bundle at its root, not a Product. This Bundle uses most of the same attributes to describe its name, version, copyright and usual UI details. For the main part, it has a Chain child that lists all the packages that have to be installed, in sequence. A RollbackBoundary tag can be used to mark what should be rolled back and what not if the user decides to roll back our installation.

Chain typically has two kinds of children: ExePackage and MsiPackage elements. Both can have either SourceFile or DownloadUrl attributes. In the first case, the setup package itself will be bundled and distributed directly with out installer (although, of course, any installer provided can be a web installer, a small executable that downloads the bulk of the material to be deployed from the Net). In the second case, the installer will be fetched from the URL supplied and then executed.

In the simple example above, both dependency packages are installed unconditionally. In real life scenarios, we usually have to check first whether we already have those packaged installed and skip their installation if they can be found on the target machine. To do so, we use conditions we are already familar with:

    <Wix xmlns="http://schemas.microsoft.com/wix/2006/wi"
         xmlns:bal="http://schemas.microsoft.com/wix/BalExtension"
         xmlns:util="http://schemas.microsoft.com/wix/UtilExtension">
      <Bundle Name="..." Version="..." Manufacturer="..." UpgradeCode="..." Copyright="..." IconSourceFile="..." AboutUrl="...">
        <BootstrapperApplicationRef Id="WixStandardBootstrapperApplication.RtfLicense" />
        
        <util:RegistrySearch Root="HKLM" Key="SOFTWARE\Microsoft\Net Framework Setup\NDP\v4\Full" Value="Version" Variable="Net4FullVersion" />
        <util:RegistrySearch Root="HKLM" Key="SOFTWARE\Microsoft\Net Framework Setup\NDP\v4\Full" Value="Version" Variable="Net4x64FullVersion" Win64="yes" />
        
        <Chain>
          <ExePackage Id="Net45" Name="Microsoft .NET Framework 4.5.1 Setup" Cache="no" Compressed="yes" PerMachine="yes" Permanent="yes" Vital="yes" InstallCommand="/q"
            SourceFile="NDP451-KB2859818-Web.exe"
            DetectCondition="(Net4FullVersion = &quot;4.5.50938&quot;) AND (NOT VersionNT64 OR (Net4x64FullVersion = &quot;4.5.50938&quot;))"
            InstallCondition="(VersionNT >= v6.0 OR VersionNT64 >= v6.0) AND (NOT (Net4FullVersion = &quot;4.5.50938&quot; OR Net4x64FullVersion = &quot;4.5.50938&quot;))"/>
        
          <ExePackage Id="Net4Full" Name="Microsoft .NET Framework 4.0 Setup" Cache="no" Compressed="yes" PerMachine="yes" Permanent="yes" Vital="yes" InstallCommand="/q"
            SourceFile="dotNetFx40_Full_setup.exe"
            DetectCondition="Net4FullVersion AND (NOT VersionNT64 OR Net4x64FullVersion)"
            InstallCondition="(VersionNT &lt; v6.0 OR VersionNT64 &lt; v6.0) AND (NOT (Net4FullVersion OR Net4x64FullVersion))"/> />
        
          <RollbackBoundary />
        
          <MsiPackage Id="MainPackage" SourceFile="Main_package.msi" DisplayInternalUI="yes" Compressed="yes" Vital="yes" />
        </Chain>
      </Bundle>
    </Wix>

And this is already more than an example; this is a fully working copy of a .NET Framework-aware installer. When compiling it, we will also need to reference some extensions:

    candle.exe -ext WixNetFxExtension -ext WixBalExtension -ext WixUtilExtension SampleBurn.wxs
    light.exe -ext WixNetFxExtension -ext WixBalExtension -ext WixUtilExtension SampleBurn.wixobj

Let's see how it works and what it does.

We have two RegistrySearch items from the utility extension to help us determine the current version of the Framework installed. Both ExePackage items have conditions that determine when to install the Framework with the provided installer. The first installs 4.5.1 on Vista and later systems if not yet present. The second installs 4.0 on XP systems if not yet present. Finally, the chain setup installs our own .msi, also specifying that it should run with its original full UI. If we don't specify this, our package will be already installed in silent mode.

The two .exe installers and our .msi will all be bundled into the single resulting SampleBurn.exe executable.

We can customize the appearance of the setup:

    <BootstrapperApplicationRef Id="WixStandardBootstrapperApplication.RtfLicense">
      <bal:WixStandardBootstrapperApplication LicenseFile="License.rtf" LogoFile="Logo.png" />
    </BootstrapperApplicationRef>
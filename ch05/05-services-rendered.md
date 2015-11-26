---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 5 Net と .NET / 5. サービスの提供
current: ch05-05
prev: 04-web-directory
prev-title: 4. ウェブ・ディレクトリ
next: /ch06/01-components-of-a-different-color
next-title: 1. 違う色のコンポーネント
origin: /net-and-net/services-rendered/
---
#  Lesson 5 Net と .NET

## 5. サービスの提供

サービスをインストールして開始することも自動的に出来ます。

{% highlight xml %}
<Component Id='ServiceExeComponent'
    Guid='YOURGUID-D752-4C4F-942A-657B02AE8325'
    SharedDllRefCount='no' KeyPath='no' NeverOverwrite='no'
    Permanent='no' Transitive='no' Win64='no' Location='either'>
  <File Id='ServiceExeFile' Name='ServiceExe.exe'
      Source='ServiceExe.exe' ReadOnly='no' Compressed='yes'
      KeyPath='yes' Vital='yes' Hidden='no'
      System='no' Checksum='no' PatchAdded='no' />
  <ServiceInstall Id='MyServiceInstall' DisplayName='My Test Service'
      Name='MyServiceExeName' ErrorControl='normal' Start='auto'
      Type='ownProcess' Vital='yes' />
  <ServiceControl Id='MyServiceControl' Name='MyServiceExeName'
      Start='install' Stop='uninstall' Remove='uninstall' />
</Component>
{% endhighlight %}

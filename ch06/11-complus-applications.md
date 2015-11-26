---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 6 COM、式の構文、その他 / 11. COM+ アプリケーション
current: ch06-11
prev: 10-xml
prev-title: 10. XML
next: 12-version-by-version
next-title: 12. バージョンごとに
origin: /com-expression-syntax-miscellanea/complus-applications/
---
#  Lesson 6 COM、式の構文、その他

## 11. COM+ アプリケーション

WiX ツールセットにあるカスタム・アクション・ライブラリを使うと、インストーラが COM+ パッケージを作ったり、
それにコンポーネントを追加したり、ロールの作成と設定をしたりすることが出来るようになります。

インストーラ・パッケージをビルドするときは、適切な WiX ライブラリを含めてコンパイルおよびリンクしなければなりません。
そのための Candle と Light のコマンド・ラインは以下のようになります。

{% highlight bat %}
candle -ext WixComPlusExtension Sample.wxs
light -ext WixComPlusExtension Sample.wixobj
{% endhighlight %}

また、WiX のソースで、下記のように COM+ スキーマを参照する必要があります。

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi"
  xmlns:complus="http://schemas.microsoft.com/wix/ComPlusExtension">
{% endhighlight %}

COM+ パッケージ(My COM+ Application)を作成して、そのパッケージに標準的な COM DLL（MyCOM.dll)を追加するためには、下記のように記述します。

{% highlight xml %}
<Component Id="MyCOM_dll" DiskId="1"
    Guid="YOURGUID-242F-4B82-BDC7-588E59E9F393">
  <File Id="MyCOM_dll" Name="MyCOM.dll"
      Source="MyCOM.dll" KeyPath="yes" Vital="yes" />
  <complus:ComPlusApplication Id="MyCOM" Name="My COM+ Application">
    <complus:ComPlusAssembly Id="MyComPlusAssembly"
        Type="native" DllPath="[#MyCOM_dll]">
      <complus:ComPlusComponent Id="MyCOM"
          CLSID="YOURCLSID-CA74-4DC7-BAEF-25AF03BC5F67" />
    </complus:ComPlusAssembly>
  </complus:ComPlusApplication>
</Component>
{% endhighlight %}

COM+ パッケージ(My COM+ Application)を作成して、
グローバル・アセンブリ・キャッシュ(GAC)に無い .NET アセンブリをそのパッケージにパッケージに追加する場合は、以下のように記述します。

{% highlight xml %}
<Component Id="MydotNet_dll" DiskId="1"
    Guid="YOURGUID-242F-4B82-BDC7-588E59E9F393">
  <File Id="MydotNet_dll" Name="MydotNet.dll" Source="MydotNet.dll"
      KeyPath="yes" Assembly="no" />
  <complus:ComPlusApplication  Id="MydotNet"
      Name="My COM+ Application">
    <complus:ComPlusAssembly Id="MyComPlusAssembly"
        DllPath="[#MydotNet_dll]" 
        TlbPath="[#MydotNet_tlb]" Type=".net" RegisterInCommit="yes">
      <complus:ComPlusComponent Id="CheckInterface"
          CLSID="YOURCLSID-241E-4472-8C71-61A22BAF9914"/>
    </complus:ComPlusAssembly>
  </complus:ComPlusApplication>
</Component>

<Component Id="MydotNet_tlb" DiskId="1"
    Guid="YOURGUID-242F-4B82-BDC7-588E59E9F394">
  <File Id="MydotNet_tlb" Name="MydotNet.tlb" Source="MydotNet.tlb"
      KeyPath="yes" />
</Component>
{% endhighlight %}

COM+ パッケージ(My COM+ Application)を作成して、
グローバル・アセンブリ・キャッシュ(GAC)に有る .NET アセンブリをそのパッケージに追加する場合は、以下のように記述します。
    
{% highlight xml %}
<Component Id="MydotNet_dll" DiskId="1"
    Guid="YOURGUID-242F-4B82-BDC7-588E59E9F393">
  <File Id="MydotNet_dll" Name="MydotNet.dll" Source="MydotNet.dll"
      KeyPath="yes" Assembly=".net" />
  <complus:ComPlusApplication Id="MydotNet"
      Name="My COM+ Application">
    <complus:ComPlusAssembly Id="MyComPlusAssembly"
        TlbPath="[#MydotNet_tlb]"
        Type=".net" DllPathFromGAC="yes" RegisterInCommit="yes">
      <complus:ComPlusComponent Id="CheckInterface"
          CLSID="YOURCLSID-241E-4472-8C71-61A22BAF9914"/>
    </complus:ComPlusAssembly>
  </complus:ComPlusApplication>
</Component>

<Component Id="MydotNet_tlb" DiskId="1" 
    Guid="YOURGUID-242F-4B82-BDC7-588E59E9F394">
  <File Id="MydotNet_tlb" Name="MydotNet.tlb" Source="MydotNet.tlb"
      KeyPath="yes" />
</Component>
{% endhighlight %}

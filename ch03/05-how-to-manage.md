---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 3 イベントとアクション / 5. マネージする方法
current: ch03-05
prev: 04-control-your-controls
prev-title: 4. コントロールをコントロールせよ
next: 06-at-a-later-stage
next-title: 6. 後の段階で
origin: /events-and-actions/how-to-manage/
---
# Lesson 3 イベントとアクション

## 5. マネージする方法

よくある質問の一つは、カスタム・アクションはマネージ・コード、つまり、C#、VB.NET またはそれに類するもので書くことが出来るか、というものです。
何と言っても、それらの実行時環境は、はるかに豊かな機能セットを提供してくれますからね。
それに、これらの言語で仕事をしているプログラマには、他のプログラミング言語をあまり知らない人もいるようです。

以前、WiX 2 の時代には、マネージ・コードでカスタム・アクションを書くためには裏技(hack)が必要で、
それは良くない危険な行為だと考えられていました。
しかし、WiX 3 になって、Deployment Tools Foundation (DTF) という
.NET クラス・ライブラリと関連するリソースのセットが導入されたことによって、事情が変りました。
依存性による制約は明白です
(インストール対象マシンに .NET が入っていることを確認しなければなりません。
おそらくは、ブートストラップ・インストーラを初めに使う必要があるでしょう。
また、ユーザーがアプリケーションをアンインストールする前に .NET Framework を削除すると、
アンインストールの際にも問題が生じる可能性があります)
が、その制約を受け入れることが出来るのであれば、前のサンプルのカスタム・アクションを C# に移植したものを以下に示します。

{% highlight csharp %}
namespace WiXTutorial.Samples
{
  using System;
  using System.Collections.Generic;
  using System.IO;
  using Microsoft.Deployment.WindowsInstaller;

  public class SampleCheckPID
  {
    [CustomAction]
    public static ActionResult CheckPID(Session session)
    {
      string Pid = session["PIDKEY"];
      session["PIDACCEPTED"] = Pid.StartsWith("1") ? "1" : "0";
      return ActionResult.Success;
    }
  }
}
{% endhighlight %}

[SampleAskKeyNET](https://www.firegiant.com/system/files/samples/SampleAskKeyNET.zip) のソース・コードには、ほんの一箇所だけ、修正が必要なところがあります。
DLL の名前は違うものになります。
と言うのは、Windows Installer とマネージされた世界の間隙を埋めるために、純粋なマネージ DLL を特殊なパッケージに包む必要があるためです。

> 訳註：SampleAskKeyNET の日本語版は [Sample-3-5-AskKeyNet.zip](/samples/Sample-3-5-AskKeyNet.zip) です。

{% highlight xml %}
  <Binary Id="CheckPID" SourceFile="CheckPIDPackage.dll" />
{% endhighlight %}

加えて、**CustomAction.config** という小さなファイルも用意して下さい。
このファイルは、マネージ・カスタム・アクションが依存するランタイムについて記述するものです。

{% highlight xml %}
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <startup>
    <supportedRuntime version="v2.0.50727"/>
  </startup>
</configuration>
{% endhighlight %}

.NET 言語で仕事をするときの相対的な容易さには代償があります。
それは、ビルドのプロセスが複雑になるということです。
IDE を使えばいくらか簡単になるでしょう。
WiX ソース・パッケージの DTF 部門の下にサンプル・プロジェクト・ファイルがあります。
ここでは、コマンド・ラインによる方法を示すことしか出来ません。
`Microsoft.Deployment.WindowsInstaller.dll`, `MakeSfxCA.exe` および `sfxca.dll` を探して下さい。
インストールした WiX ツールセットの中にある筈です。
下記のコマンドで、*path* として記述している箇所は、省略しない絶対パスを指定しなければいけません。
そうしないと、MakeSfxCA はエラー・メッセージを出し、作成される DLL は役に立たない物になります。

{% highlight bat %}
csc.exe /target:library
        /reference:path\Microsoft.Deployment.WindowsInstaller.dll
        /out:CheckPID.dll CheckPID.cs
MakeSfxCA.exe path\CheckPIDPackage.dll
              path\sfxca.dll path\CheckPID.dll
              path\CustomAction.config
              path\Microsoft.Deployment.WindowsInstaller.dll
candle.exe SampleAskKeyNET.wxs UserRegistrationDlg.wxs
light.exe -ext WixUIExtension -out SampleAskKeyNET.msi
          SampleAskKeyNET.wixobj UserRegistrationDlg.wixobj
{% endhighlight %}

ツールセットの中には DTF 自体のドキュメントがあります。
従って、このチュートリアルでは、DTF についてこれ以上言及しません。そちらのドキュメントとサンプル・コードを使って下さい。
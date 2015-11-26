---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 2 ユーザー・インタフェイス / 6. 地域化を考える
current: ch02-06
prev: 05-new-link-in-the-chain
prev-title: 5. チェーンの新しい環
next: /ch03/index
next-title: Lesson 3 イベントとアクション
origin: /user-interface/think-localized/
---
# Lesson 2 ユーザー・インタフェイス

## 6. 地域化を考える

私たち独自のダイアログを WixUI に追加したら、同じように地域化(ローカライズ)もしたいですね。
そのためにかかる余分の手間は、それほど大きくはありません。
メインのソース・ファイルは同じままです。
修正しなければならないのは、**UserRegistrationDlg.wxs** の中の新しいダイアログだけです。
固定されたテキストの代りに、地域化できる文字列参照を使います。

{% highlight xml %}
  <Fragment>
    ...
      <Dialog Id="UserRegistrationDlg" Width="370" Height="270"
          Title="!(loc.UserRegistrationDlg_Title)" NoMinimize="yes">
        <Control Id="NameLabel" Type="Text"
            X="45" Y="73" Width="100" Height="15"
            TabSkip="no"
            Text="!(loc.UserRegistrationDlg_UserName)" />
        <Control Id="OrganizationLabel" Type="Text"
            X="45" Y="110" Width="100" Height="15"
            TabSkip="no"
            Text="!(loc.UserRegistrationDlg_Organization)" />
    ...
  </Fragment>
</Wix>
{% endhighlight %}

次に、これらの文字列の一覧を記載した地域化ファイルを適切なカルチャで作成します。
ここでは、そのファイルを **UserRegistrationDlg.fr-fr.wxl** と呼ぶことにしましょう
(ファイル名はあなた次第ですが、拡張子 `.wxl` は固定されています)。
**WixLocalization** タグの中で、カルチャとコードページを指定しなければいけません。
地域化したい他の言語についても、同様な複製を作って下さい。

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<WixLocalization Culture="fr-fr" Codepage="1252"
    xmlns="http://schemas.microsoft.com/wix/2006/localization">
  <String Id="UserRegistrationDlg_Title"
      Overridable="yes">???</String>
  <String Id="UserRegistrationDlg_UserName"
      Overridable="yes">???</String>
  <String Id="UserRegistrationDlg_Organization"
      Overridable="yes">???</String>
  ...
</WixLocalization>
{% endhighlight %}

サンプル・ソース ([SampleWixUIAddDlgLoc](https://www.firegiant.com/system/files/samples/SampleWixUIAddDlgLoc.zip))
からインストーラをビルドするためには、地域化ファイルも参照する必要があります。
統合環境では、地域化ファイルは、プロジェクトに含めるだけで、自動的に使用されるようになります。

{% highlight batch %}
candle.exe SampleWixUIAddDlgLoc.wxs UserRegistrationDlg.wxs
light.exe -ext WixUIExtension -cultures:fr-fr
          -loc UserRegistrationDlg.fr-fr.wxl
          -out SampleWixUIAddDlgLoc.msi
          SampleWixUIAddDlgLoc.wixobj UserRegistrationDlg.wixobj
{% endhighlight %}

>  訳註：SampleWixUIAddDlgLoc の日本語版を [Sample-2-6-WixUIAddDlgLoc.zip](/samples/Sample-2-6-WixUIAddDlgLoc.zip) として用意しました。
> これまでメインのソースに埋め込んでいた日本語のテキストも地域化ファイルに分離しています。
> そのため、コマンド・ラインで指定しなければならない地域化ファイルの数が、上記のコマンド・ラインの例より増えています。
> 
> なお、日本語版のサンプルで示しているように、GUID も地域化ファイルの中で定義する事が出来ますが、
> その場合は GUID をブレース(波括弧 {})で囲む必要があります。
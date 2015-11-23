---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 5 Net と .NET / 3. インターネットを起動する
current: ch05-03
prev: 02-bootstrapping
prev-title: 2. ブートストラップ
next: 04-web-directory
next-title: 4. ウェブ・ディレクトリ
origin: /net-and-net/launch-the-internet/
---
#  Lesson 5 Net と .NET

## 3. インターネットを起動する

ローカルまたはオンラインで、何かをブラウザで起動したい場合があるでしょう。
そうするために、ユーザーのディスク上に URL のリンクを作成することが出来ます。
URL のリンクは実際には `.ini` ファイルの形式を取りますので、**IniFile** を使ってリンクを作成します。

    <Component>
      ...
      <IniFile Id='Launch' Action='addLine' Name='Launch.url'
          Directory='INSTALLDIR' Section='InternetShortcut'
          Key='URL' Value='http://www.acmefoobar.com' />
      ...
    </Component>

既定のブラウザを直接起動するためには、最初に既定のブラウザのパスを調べて、インストールの完了後に、
そのパスを使って、通常の方法でカスタム・アクションとして起動します
(ただし、インストールの時だけです。アンインストールの時はブラウザを起動しません)。
ユーザーが既定のブラウザとして選んでいるブラウザが必ず起動されるように、必ずこの方法を使ってください。
*決して特定のブラウザをハード・コーディングしないで下さい*。

    <Property Id="BROWSER">
      <RegistrySearch Id='DefaultBrowser' Type='raw'
          Root='HKCR' Key='http\shell\open\command' />
    </Property>
    
    <CustomAction Id='LaunchBrowser' Property='BROWSER'
          ExeCommand='www.piyosoftware.co.jp' Return='asyncNoWait' />
    
    <InstallExecuteSequence>
      ...
      <Custom Action='LaunchBrowser'
          After='InstallFinalize'>NOT Installed</Custom>
    </InstallExecuteSequence>

完全な [SampleBrowser](https://www.firegiant.com/system/files/samples/SampleBrowser.zip) をダウンロードすることが出来ます。

> 訳註：SampleBrowser の日本語版は [Sample-5-3-Browser.zip](/samples/Sample-5-3-Browser.zip) です。

デスクトップやスタート・メニューに、既定のブラウザを起動して特定のウェブ・サイトに飛ぶショートカットを作ることは、
さらに簡単に出来ます。
注意しなければならないことは、URL にプロパティを使用する、ということだけです。
ショートカットの **Target** 属性に直接に URL を書くと、コンパイラがそれを配置すべきローカル・ファイルの名前だと見なすために、うまく行きません。

    <Property Id="URL" Value="http://www.something.com" />
    
    <Shortcut Id="WebShortcut" Name="ぴよソフトのウェブ"
        Description="ぴよソフトのウェブサイトにジャンプします。"
        Target="[URL]" />

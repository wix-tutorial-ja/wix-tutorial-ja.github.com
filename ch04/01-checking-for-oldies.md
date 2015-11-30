---
layout: default
title: WiX チュートリアル 日本語訳 Lesson 4 アップグレードとモジュラー化 / 1. 古いのを探す
chapter: ch04
current: ch04-01
prev: index
prev-title: Lesson 4 アップグレードとモジュラー化
next: 02-replacing-ourselves
next-title: 2. 自分自身を置き換える
origin: /upgrades-and-modularization/checking-for-oldies/
---
# Lesson 4 アップグレードとモジュラー化

## 1. 古いのを探す

何らかのアップデートやアップグレードをするときに最初にすることは、変更したい前のバージョンが有ることを確認することです。

Windows Installer はそれを確認するために **Product** タグの **UpgradeCode** 属性を頼りにします。
そのため、現在のプログラムを後でアップグレードする予定が無い場合であっても、常に製品に UpgradeCode を持たせておくことが非常に重要です。
将来のことは決して分りませんし、一旦外に出してしまってからでは、もう出荷し直すことは出来ません。

製品を同じアップグレード・バージョンでアップグレードしようとする限りは、同一の **UpgradeCode** GUID を保持してください。
通常の場合、このことは、Version 1.x の全てに一つのコード、Version 2.x にもう一つ別のコード、、、ということを意味します。

{% highlight xml %}
<?xml version='1.0' encoding='utf-8'?>
<Wix xmlns='http://schemas.microsoft.com/wix/2006/wi'>
  <Product Name='ほげ 1.0'
      Id='YOURGUID-86C7-4D14-AEC0-86416A69ABDE'
      UpgradeCode='YOURGUID-7349-453F-94F6-BCB5110BA4FD'
      Version='1.0.0' Manufacturer='ぴよソフト'
      Language='1041' Codepage='932'>
    <Package Id='*' Keywords='インストーラ'
        Description="ぴよソフト's ほげ 1.0 インストーラ"
        Comments='ほげはぴよソフトの登録商標です。'
        Manufacturer='ぴよソフト' InstallerVersion='100'
        Languages='1041' Compressed='yes' SummaryCodepage='932' />
      ...
    </Package>
  </Product>
</Wix>
{% endhighlight %}

今回の [SampleUpgrade](https://www.firegiant.com/system/files/samples/SampleUpgrade.zip)
は、二つのインストーラ・パッケージから成り立っています。
両方とも、簡単な UI のインストーラ、SampleWixUI を元にしています。

> 訳註：SampleUpgrade の日本語版は [Sample-4-1-Upgrade.zip](/samples/Sample-4-1-Upgrade.zip) です。

SampleUpgrade の第二のバージョンは、配置されたファイルの一つを新しいバージョンで置き換えるためのものです。
私たちはこれを*マイナー・アップグレード*だと考えて、**Version** を変えています。
外見上の変更が、人間が読むことが出来る **Name** と **Description** に対して加えられていることは言うまでもありません。

{% highlight xml %}
<Product Name='ほげ 1.0.1'
    Id='YOURGUID-86C7-4D14-AEC0-86416A69ABDE'
    UpgradeCode='YOURGUID-7349-453F-94F6-BCB5110BA4FD'
    Version='1.0.1' Manufacturer='ぴよソフト'
    Language='1041' Codepage='932'>
  <Package Id='*' Keywords='インストーラ'
      Description="ぴよソフト's ほげ 1.0.1 アップデータ" ... >
{% endhighlight %}

製品のどのバージョンをこのアップグレードによって置き換える予定なのか、ということについての記述も必要です。
**Upgrade** タグの **Id** 属性が、元のインストーラ・パッケージ(この例では古い方の SampleUpgrade)の **UpgradeCode** GUID を参照しています。
内部の **UpgradeVersion** タグは、更新対象となるバージョンの詳細を記述しています。
**OnlyDetect** は、インストーラに、前の製品を削除しないように指示しています
(思い出してください。私たちはマイナー・アップグレードをやっています。
製品の古いバージョンを維持しながら、ファイルを一つだけ置き換えるのです。
もし、メジャー・アップグレードをやっているのだとしたら、そうする代りに、1.0.0 を*削除*して、1.1.0 を*インストール*するでしょう)。

**Minimum** と **Maximum** が、このアップグレード・パッケージで更新することになるバージョンの範囲を示しています。
**IncludeMaximum** と **IncludeMinimum** は、境界値が範囲に含まれるか否かを指定します
(**IncludeMaximum = yes** は **Maximum** で指定されたバージョン *より低いか等しい* バージョンを探すことを意味し、
**IncludeMaximum = no** は **Maximum** *より低い* ものだけを探すことを意味します)。
これらの属性には既定値がありますが、ここでは、既定値には頼らず、常に明示的に記述することにします – 
明解さと自己完結的な説明性のためには、省略せずに書く方が良いでしょう。

{% highlight xml %}
  <Upgrade Id='YOURGUID-7349-453F-94F6-BCB5110BA4FD'>
    <UpgradeVersion OnlyDetect='yes' Property='SELFFOUND'
        Minimum='1.0.1' IncludeMinimum='yes'
        Maximum='1.0.1' IncludeMaximum='yes' />
    <UpgradeVersion OnlyDetect='yes' Property='NEWERFOUND'
        Minimum='1.0.1' IncludeMinimum='no' />
  </Upgrade>
{% endhighlight %}

> 訳註：実際にここで探そうとしているのは、更新する対象のバージョンではありません。
> そうではなくて、更新する必要のないバージョン、すなわち自分自身(SELFFOUND)、および、
> 更新してはいけないバージョン、すなわち自分よりも新しいバージョン(NEWERFOUND)を探そうとしています。

ソース・ファイルの中で **Upgrade** タグを使うと、新しい標準的なアクション、**FindRelatedProducts** が導入されます。
このアクションは、もし有れば、**AppSearch** の直前に走るようにスケジュールされます。
必要な場合には、**InstallExecuteSequence** タグの中で、スケジュールを変更することも出来ます。

**FindRelatedProducts** は **Upgrade** タグの中を全部見て、リスト・アップされている全てのバージョンを探します。
該当するバージョンが存在した場合は、**UpgradeVersion** タグで指定されているプロパティ
(この例では **SELFFOUND** または **NEWERFOUND**)に、そのバージョンの **Product** GUID が追記されます。
言うまでもなく、Windows Installer が探すことが出来るのは、指定された **UpgradeCode** を持っている `.msi`
パッケージでインストールされた製品だけです — UpgradeCode を常に指定することが重要だという意味がこれで分ったでしょう。

もし、地域化されたソフトウェア・パッケージを開発しているのであれば、**UpgradeVersion** と **Product** タグの両方で 
**Language** 属性を指定することが可能です。
言語を指定するためには、いつものように Windows の言語識別子の数値を使って下さい。
言語を指定すると、**FindRelatedProducts** は、該当する言語の製品だけを探します。

私たちは、チェックが走った後で、関連するプロパティの存在および値に基づいて、適切な行動を取ることが出来ます。

{% highlight xml %}
  <CustomAction Id='AlreadyUpdated'
      Error='[ProductName] は既に 1.0.1 に更新されています。' />
  <CustomAction Id='NoDowngrade'
      Error='[ProductName] の新しいバージョンが既にインストールされています。' />

  <InstallExecuteSequence>
    <Custom Action='AlreadyUpdated'
        After='FindRelatedProducts'>SELFFOUND</Custom>
    <Custom Action='NoDowngrade' 
        After='FindRelatedProducts'>NEWERFOUND</Custom>
  </InstallExecuteSequence>
{% endhighlight %}

どういう理由かは知りませんが、スモール・アップデートとマイナー・アップグレードは、
`.msi` ファイルをダブル・クリックするだけでは走らせることが出来ません。
*"この製品の別のバージョンが既にインストールされています"* というエラーが出るのです。

知っとるわぃ、ボケ ... とにかく、コマンド・ラインから起動しなくてはならないのです。

{% highlight bat %}
msiexec /i SampleUpgrade.msi REINSTALL=ALL REINSTALLMODE=vomus
{% endhighlight %}

どうやってこんな事を平均的なユーザーにやって貰おうか、などと尋ねるのはやめて下さいね。
`Autorun.inf` ファイルから起動したり、起動用の `Setup.exe` ラッパー・シェルをひねり出したりする方が良いですよ。

ご覧のように、このアップグレード・バージョンは双方向に正しく動作します。
これは自分より古いパッケージを置き換えますが、それだけでなく、将来、
プログラムがもっと先まで(例えば 1.0.2 以降に)更新されていた場合でも、対処出来ます。
より新しいバージョンを 1.0.1 にダウングレードして戻すようなことはしません。
絶対確実に間違いが無いようにするためには、このことは前もって計画しておかなくてはいけません。
一番初めに出荷するインストーラであっても、このセーフティー・ロックが組み込まれていなくてはなりません
(その事を現在のサンプルの古い方のバージョンで確認して下さい)。

{% highlight xml %}
  <Upgrade Id='YOURGUID-7349-453F-94F6-BCB5110BA4FD'>
    <UpgradeVersion OnlyDetect='yes' Property='NEWERFOUND'
                    Minimum='1.0.0' IncludeMinimum='no' />
  </Upgrade>

  <CustomAction Id='NoDowngrade'
      Error='[ProductName] の新しいバージョンが既にインストールされています。' />

  <InstallExecuteSequence>
    <Custom Action='NoDowngrade'
        After='FindRelatedProducts'>NEWERFOUND</Custom>
  </InstallExecuteSequence>
{% endhighlight %}

> 訳註：この章で説明されている「セーフティー・ロック」機構は、実際には、
> プロダクト・コードが異なるパッケージ同士の間 (すなわち、メジャー・アップグレード) でなければ、期待している通りの動作はしません。
>
> スモール・アップデートおよびマイナー・アップグレードの場合、すなわち、プロダクト・コードが同じパッケージ同士の間では、
> `"msiexec /i SampleUpgrade.msi REINSTALL=ALL REINSTALLMODE=vomus"` 
> によってパッケージを起動する必要があることは、本文で述べられている通りです。
> この場合、Windows Installer は **メンテナンス・モード** で走ることになります。
> ところが、メンテナンス・モードにおいては、FindRelatedProducts は何もせずに帰ってきてしまいます。
> つまり、SELFFOUND も NEWERFOUND も設定されず、結果として、'AlreadyUpdated' も 'NoDowngrade' も、実行されることは決してありません。
> 具体的に言うと、1.0.1 をインストールした後に 1.0.0 のインストーラを上記のコマンド・ラインで起動すると、
> 何の警告も表示せずに、最後まで走ってしまうのです。
>
> `"REINSTALLMODE=vomus"` の場合、Windows Installer がファイルのバージョン番号(ファイルにバージョン番号がある場合)
> や更新日付を見て、ファイル単位でダウングレードを防止しますので、致命的な実害は生じません。
> しかし、実際の動作と、ユーザーに対するフィードバックとの間に無視できないズレが生じますので、気持ちが悪いことは否定できません。
> 
> なお、プロダクト・コードが異なるパッケージ同士の間、すなわち、**メジャー・アップグレード** では、
> この「セーフティー・ロック」機構が有効に働きます。
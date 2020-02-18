/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import LottieView from 'lottie-react-native';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstString: '',
      secondString: '',
      levenshteinDistance: 0,
      matrix: undefined,
      color: [],
    };
  }
  render() {
    console.log(this.state.matrix);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View>
        <LottieView
              source={require('App/Assets/Images/App_Loader.json')}
              autoPlay={true}
              loop={true}
            />
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 32, fontFamily: 'serif', color: '#1c6ca5'}}>
            Levenshtein Distance
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-between',
            width: '95%',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: '30%',
              padding: 5,
            }}>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: '60%',
                height: '100%',
                borderWidth: 0.8,
                borderColor: '#1c6ca5',
                borderRadius: 10,
              }}>
              <TextInput onChangeText={this.setfirstString} />
            </View>
            <View style={{justifyContent: 'center', padding: 10}}>
              <Text>First String</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: '30%',
              padding: 5,
            }}>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: '60%',
                height: '100%',
                borderWidth: 0.8,
                borderColor: '#1c6ca5',
                borderRadius: 10,
              }}>
              <TextInput onChangeText={this.setSecondString} />
            </View>
            <View style={{justifyContent: 'center', padding: 10}}>
              <Text>Second String</Text>
            </View>
          </View>
          <View
            style={{
              height: '30%',
              width: '60%',
              backgroundColor: '#1c6ca5',
              justifyContent: 'center',
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.calculateLevenshteinDistance()}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Calculate</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 6, justifyContent: 'center', alignItems: 'center'}}>
          {this.state.matrix && (
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 40, height: 40}} />
              <View style={{width: 40, height: 40}} />
              {this.state.firstString.split('').map((data, jindex) => {
                return (
                  <View style={{width: 40, height: 40}}>
                    <Text>{data}</Text>
                  </View>
                );
              })}
            </View>
          )}
          {this.state.matrix &&
            this.state.matrix.map((item, index) => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 40, height: 40}}>
                    {index !== 0 && (
                      <Text>
                        {this.state.secondString.split('')[index - 1]}
                      </Text>
                    )}
                  </View>
                  {item.map((data, jindex) => {
                    let fill = false;
                    this.state.color.filter(e => {
                      console.log(e, index, jindex);
                      if (e.i == index && e.j == jindex) {
                        fill = true;
                      }
                    });
                    return (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderWidth: 1,
                          borderColor: '#24a0ed',
                          backgroundColor: fill ? '#002147' : 'white',
                        }}>
                        <Text style={{color: fill ? 'white' : 'black'}}>
                          {this.state.matrix[index][jindex]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Levenshtein Distance: {this.state.levenshteinDistance}</Text>
        </View>
      </View>
    );
  }

  setfirstString = text => {
    this.setState({firstString: text});
  };

  setSecondString = text => {
    this.setState({secondString: text});
  };

  calculateLevenshteinDistance = () => {
    let a = this.state.firstString.toLowerCase().split('');
    let b = this.state.secondString.toLowerCase().split('');
    let c = new Array(b.length);
    for (let i = 0; i <= b.length; i++) {
      c[i] = new Array(a.length);
    }
    c[0][0] = 0;
    a.map((item, index) => {
      c[0][index + 1] = index + 1;
    });
    b.map((item, index) => {
      c[index + 1][0] = index + 1;
    });
    for (let i = 1; i < c.length; i++) {
      for (let j = 1; j < c[0].length; j++) {
        if (b[i - 1] !== a[j - 1]) {
          c[i][j] = Math.min(
            c[i - 1][j - 1] + 1,
            c[i - 1][j] + 1,
            c[i][j - 1] + 1,
          );
        } else {
          c[i][j] = Math.min(c[i - 1][j] + 1, c[i][j - 1] + 1, c[i - 1][j - 1]);
        }
      }
    }
    this.setState({levenshteinDistance: c[b.length][a.length]});
    let temp = [];
    this.setState({matrix: c}, () => {
      this.calculate(b.length, a.length, temp);
      this.setState({color: temp});
    });
  };

  calculate = (row, column, array) => {
    array.push({i: row, j: column});
    let pos =
      row === 0
        ? 0
        : column === 0
        ? 1
        : [
            this.state.matrix[row][column - 1],
            this.state.matrix[row - 1][column],
            this.state.matrix[row - 1][column - 1],
          ].indexOf(
            Math.min(
              ...[
                this.state.matrix[row][column - 1],
                this.state.matrix[row - 1][column],
                this.state.matrix[row - 1][column - 1],
              ],
            ),
          );
    if (row - 1 === 0 && column - 1 === 0) {
      return 0;
    } else {
      switch (pos) {
        case 0:
          this.calculate(row, column - 1, array);
          break;
        case 1:
          this.calculate(row - 1, column, array);
          break;
        case 2:
          this.calculate(row - 1, column - 1, array);
          break;
      }
    }
  };
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

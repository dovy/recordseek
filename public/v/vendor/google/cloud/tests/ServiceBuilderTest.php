<?php
/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Cloud\Tests;

use Google\Cloud\ServiceBuilder;

class ServiceBuilderTest extends \PHPUnit_Framework_TestCase
{
    public function testBuildsStorageClientWithGlobalConfig()
    {
        $gcloud = new ServiceBuilder(['projectId' => 'myProject']);

        $this->assertInstanceOf('Google\Cloud\Storage\StorageClient', $gcloud->storage());
    }

    public function testBuildsStorageClientWithOverriddenConfig()
    {
        $gcloud = new ServiceBuilder();
        $storage = $gcloud->storage([
            'projectId' => 'myProject',
            'scopes' => ['somescope'],
            'httpHandler' => function() {
                return;
            }
        ]);

        $this->assertInstanceOf('Google\Cloud\Storage\StorageClient', $storage);
    }

    /**
     * @expectedException InvalidArgumentException
     */
    public function testStorageThrowsExceptionWithoutProjectId()
    {
        $gcloud = new ServiceBuilder();
        $gcloud->storage();
    }
}
